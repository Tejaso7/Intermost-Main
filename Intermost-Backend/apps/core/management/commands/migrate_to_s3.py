import os
import re
import urllib.parse
import mimetypes
import requests
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
import boto3
from botocore.exceptions import ClientError
from apps.mongodb import get_collection


class Command(BaseCommand):
    help = 'Migrate local/remote media files & MongoDB assets to AWS S3 in structured subfolders.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate migration without modifying MongoDB or uploading to S3.',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        self.stdout.write(self.style.MIGRATE_HEADING("=== Starting AWS S3 Media Migration ==="))

        aws_key = getattr(settings, 'AWS_ACCESS_KEY_ID', '') or os.environ.get('AWS_ACCESS_KEY_ID', '')
        aws_secret = getattr(settings, 'AWS_SECRET_ACCESS_KEY', '') or os.environ.get('AWS_SECRET_ACCESS_KEY', '')
        bucket_name = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', '') or os.environ.get('AWS_STORAGE_BUCKET_NAME', '')
        region_name = getattr(settings, 'AWS_S3_REGION_NAME', '') or os.environ.get('AWS_S3_REGION_NAME', 'ap-southeast-2')

        if not aws_key or not aws_secret or not bucket_name:
            self.stdout.write(self.style.ERROR("AWS S3 credentials missing! Please configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_STORAGE_BUCKET_NAME in .env"))
            return

        self.stdout.write(f"Target Bucket: {bucket_name} ({region_name})")

        s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_key,
            aws_secret_access_key=aws_secret,
            region_name=region_name
        )

        def upload_url_or_path_to_s3(source_val: str, folder_name: str) -> str:
            if not source_val or not isinstance(source_val, str):
                return source_val

            if f"{bucket_name}.s3" in source_val:
                return source_val

            filename = os.path.basename(urllib.parse.urlparse(source_val).path)
            if not filename or filename == '/':
                filename = f"asset_{os.urandom(4).hex()}.jpg"

            clean_filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
            s3_key = f"media/{folder_name}/{clean_filename}"
            s3_url = f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

            content_type, _ = mimetypes.guess_type(clean_filename)
            if not content_type:
                content_type = 'image/jpeg' if clean_filename.lower().endswith(('.jpg', '.jpeg', '.webp')) else 'application/octet-stream'

            if dry_run:
                self.stdout.write(self.style.WARNING(f"[DRY-RUN] Would upload {source_val} -> {s3_url}"))
                return s3_url

            file_bytes = None

            if source_val.startswith(('http://', 'https://')):
                try:
                    res = requests.get(source_val, timeout=15)
                    if res.status_code == 200:
                        file_bytes = res.content
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Could not fetch remote URL {source_val}: {e}"))
            else:
                possible_paths = [
                    Path(settings.BASE_DIR) / source_val.lstrip('/'),
                    Path(settings.BASE_DIR) / 'media' / source_val.lstrip('/'),
                    Path(settings.BASE_DIR).parent / 'Intermost-Frontend' / 'public' / source_val.lstrip('/'),
                ]
                for p in possible_paths:
                    if p.is_file():
                        with open(p, 'rb') as f:
                            file_bytes = f.read()
                        break

            if file_bytes:
                try:
                    s3_client.put_object(
                        Bucket=bucket_name,
                        Key=s3_key,
                        Body=file_bytes,
                        ContentType=content_type
                    )
                    self.stdout.write(self.style.SUCCESS(f"Uploaded: {s3_key}"))
                    return s3_url
                except ClientError as ce:
                    self.stdout.write(self.style.ERROR(f"Failed to upload to S3: {ce}"))
            
            return source_val

        collections_config = [
            {
                'name': 'countries',
                'folder': 'countries',
                'fields': ['flag_url', 'banner_image', 'hero_image']
            },
            {
                'name': 'colleges',
                'folder': 'colleges',
                'fields': ['logo', 'banner_image', 'hero_image']
            },
            {
                'name': 'glimpses',
                'folder': 'glimpses',
                'fields': ['image_url', 'thumbnail_url']
            },
            {
                'name': 'offices',
                'folder': 'offices',
                'fields': ['image_url']
            },
            {
                'name': 'news',
                'folder': 'news',
                'fields': ['cover_image', 'image_url']
            },
            {
                'name': 'brochures',
                'folder': 'brochures',
                'fields': ['pdf_url', 'cover_image', 'file_url']
            },
            {
                'name': 'testimonials',
                'folder': 'testimonials',
                'fields': ['student_image', 'image_url']
            }
        ]

        total_updated = 0
        for cfg in collections_config:
            coll_name = cfg['name']
            folder = cfg['folder']
            fields = cfg['fields']

            coll = get_collection(coll_name)
            docs = list(coll.find({}))
            self.stdout.write(f"\nProcessing collection: {coll_name} ({len(docs)} documents)...")

            for doc in docs:
                updates = {}
                for field in fields:
                    if field in doc and doc[field]:
                        val = doc[field]
                        if isinstance(val, str):
                            new_url = upload_url_or_path_to_s3(val, folder)
                            if new_url != val:
                                updates[field] = new_url
                        elif isinstance(val, list):
                            new_list = [upload_url_or_path_to_s3(v, folder) if isinstance(v, str) else v for v in val]
                            if new_list != val:
                                updates[field] = new_list

                if updates and not dry_run:
                    coll.update_one({'_id': doc['_id']}, {'$set': updates})
                    total_updated += 1
                    self.stdout.write(self.style.SUCCESS(f"  Updated document {doc.get('_id')}"))

        # RECURSIVE STATIC MEDIA SCANNER FOR JPG, PNG, WEBP, SVG, MP3, MP4, PDF
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== Scanning Static Public Media Assets (JPG, PNG, WEBP, SVG, MP3, MP4, PDF) ==="))
        
        possible_public_dirs = [
            Path(settings.BASE_DIR) / 'frontend_public',
            Path('/app/frontend_public'),
            Path(settings.BASE_DIR).parent / 'Intermost-Frontend' / 'public',
        ]
        
        public_dir = None
        for pdir in possible_public_dirs:
            if pdir.exists() and pdir.is_dir():
                public_dir = pdir
                break

        static_count = 0
        if public_dir:
            self.stdout.write(f"Found frontend public directory: {public_dir}")
            for filepath in public_dir.rglob('*'):
                if filepath.is_file() and filepath.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp3', '.mp4', '.pdf', '.gif'):
                    rel_path = filepath.relative_to(public_dir).as_posix()
                    s3_key = f"static/{rel_path}"
                    s3_url = f"https://{bucket_name}.s3.{region_name}.amazonaws.com/{s3_key}"

                    content_type, _ = mimetypes.guess_type(str(filepath))
                    if not content_type:
                        content_type = 'application/octet-stream'

                    if dry_run:
                        self.stdout.write(self.style.WARNING(f"[DRY-RUN] Static asset: {rel_path} -> {s3_url}"))
                        static_count += 1
                    else:
                        try:
                            with open(filepath, 'rb') as f:
                                s3_client.put_object(
                                    Bucket=bucket_name,
                                    Key=s3_key,
                                    Body=f.read(),
                                    ContentType=content_type
                                )
                            self.stdout.write(self.style.SUCCESS(f"Uploaded static: {s3_key}"))
                            static_count += 1
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"Failed uploading {rel_path}: {e}"))
        else:
            self.stdout.write(self.style.WARNING("Frontend public directory not found inside container."))

        self.stdout.write(self.style.SUCCESS(f"\n=== Migration Complete! Updated {total_updated} MongoDB docs & {static_count} static media assets ==="))
