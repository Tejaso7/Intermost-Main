"""
Update Country Videos - Maps scraped YouTube videos to country records in MongoDB.
Run: venv\\Scripts\\python.exe scripts/update_country_videos.py
"""

import os
import sys
import django

# Setup Django
try:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
except NameError:
    BASE_DIR = os.path.abspath('.')

sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.mongodb import get_collection

def update_country_videos():
    print("Updating country videos in database...")
    col = get_collection('countries')
    
    # Map country slugs to YouTube embed links from the old website
    updates = {
        'russia': 'https://www.youtube.com/embed/JZgeDZOlSl0',
        'georgia': 'https://www.youtube.com/embed/qsRofiNxeRY',
        'uzbekistan': 'https://www.youtube.com/embed/2m1pOvKRhsU',
        'kazakhstan': 'https://www.youtube.com/embed/I3JH4adBwUk',  # Kyrgyz / Kazakhstan region
        'nepal': 'https://www.youtube.com/embed/7kGQyoaKv5I',
        'ukraine': 'https://www.youtube.com/embed/GZoixzGgYNA'
    }
    
    for slug, video_url in updates.items():
        res = col.update_one({'slug': slug}, {'$set': {'hero_video': video_url}})
        print(f"Country '{slug}': matched {res.matched_count}, modified {res.modified_count}")
    
    print("Country videos update completed!")

if __name__ == '__main__':
    update_country_videos()
