"""
File Upload Views - Handle image and video uploads.
Stores files in the frontend public folder for direct access.
"""

import os
import uuid
from pathlib import Path
from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Path to frontend public folder (relative to backend)
FRONTEND_PUBLIC_PATH = Path(settings.BASE_DIR).parent / 'intermost-frontend' / 'public'


def get_upload_folder(category: str) -> Path:
    """Get the appropriate upload folder based on category."""
    folders = {
        'countries': 'images/countries',
        'news': 'images/news',
        'team': 'images/team',
        'testimonials': 'images/testimonials',
        'blogs': 'images/blogs',
        'colleges': 'images/colleges',
        'general': 'images/uploads',
        'videos': 'video/uploads',
    }
    return FRONTEND_PUBLIC_PATH / folders.get(category, 'images/uploads')


def generate_filename(original_name: str) -> str:
    """Generate a unique filename while preserving extension."""
    ext = os.path.splitext(original_name)[1].lower()
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    # Clean filename
    name = os.path.splitext(original_name)[0]
    name = ''.join(c if c.isalnum() or c in '-_' else '_' for c in name)[:30]
    return f"{name}_{timestamp}_{unique_id}{ext}"


class FileUploadView(APIView):
    """Upload single or multiple files."""
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        files = request.FILES.getlist('files') or request.FILES.getlist('file')
        if not files:
            # Check for single file
            if 'file' in request.FILES:
                files = [request.FILES['file']]
            else:
                return Response(
                    {'error': 'No files provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        category = request.data.get('category', 'general')
        upload_folder = get_upload_folder(category)
        
        # Create folder if it doesn't exist
        upload_folder.mkdir(parents=True, exist_ok=True)
        
        uploaded_files = []
        
        for file in files:
            # Validate file type
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov']
            ext = os.path.splitext(file.name)[1].lower()
            if ext not in allowed_extensions:
                continue
            
            # Validate file size (max 50MB)
            if file.size > 50 * 1024 * 1024:
                continue
            
            # Generate unique filename
            filename = generate_filename(file.name)
            filepath = upload_folder / filename
            
            # Save file
            try:
                with open(filepath, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
                
                # Calculate relative URL path
                relative_path = str(filepath.relative_to(FRONTEND_PUBLIC_PATH))
                url_path = '/' + relative_path.replace('\\', '/')
                
                uploaded_files.append({
                    'original_name': file.name,
                    'filename': filename,
                    'url': url_path,
                    'size': file.size,
                    'category': category
                })
                
                logger.info(f"File uploaded: {filename} to {category}")
                
            except Exception as e:
                logger.error(f"Error uploading file {file.name}: {str(e)}")
        
        if not uploaded_files:
            return Response(
                {'error': 'No valid files were uploaded'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': f'{len(uploaded_files)} file(s) uploaded successfully',
            'files': uploaded_files
        }, status=status.HTTP_201_CREATED)


class FileDeleteView(APIView):
    """Delete an uploaded file."""
    permission_classes = [AllowAny]
    
    def delete(self, request):
        file_path = request.data.get('path', '')
        
        if not file_path:
            return Response(
                {'error': 'File path is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove leading slash and construct full path
        if file_path.startswith('/'):
            file_path = file_path[1:]
        
        full_path = FRONTEND_PUBLIC_PATH / file_path
        
        # Security check - ensure path is within public folder
        try:
            full_path.resolve().relative_to(FRONTEND_PUBLIC_PATH.resolve())
        except ValueError:
            return Response(
                {'error': 'Invalid file path'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not full_path.exists():
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            os.remove(full_path)
            return Response({'message': 'File deleted successfully'})
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return Response(
                {'error': 'Failed to delete file'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FileListView(APIView):
    """List uploaded files in a category."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        category = request.query_params.get('category', 'general')
        upload_folder = get_upload_folder(category)
        
        if not upload_folder.exists():
            return Response({'files': []})
        
        files = []
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov']
        
        for file in upload_folder.iterdir():
            if file.is_file() and file.suffix.lower() in allowed_extensions:
                relative_path = str(file.relative_to(FRONTEND_PUBLIC_PATH))
                url_path = '/' + relative_path.replace('\\', '/')
                
                files.append({
                    'filename': file.name,
                    'url': url_path,
                    'size': file.stat().st_size,
                    'modified': datetime.fromtimestamp(file.stat().st_mtime).isoformat()
                })
        
        # Sort by modified date, newest first
        files.sort(key=lambda x: x['modified'], reverse=True)
        
        return Response({
            'category': category,
            'count': len(files),
            'files': files
        })
