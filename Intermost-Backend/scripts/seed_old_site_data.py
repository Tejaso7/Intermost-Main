"""
Seed Old Site Data - Seeds scraped testimonials and YouTube Shorts into MongoDB.
Run: python manage.py shell < scripts/seed_old_site_data.py
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
try:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
except NameError:
    BASE_DIR = os.path.abspath('.')

sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.mongodb import get_collection

def seed_old_site_data():
    print("Starting database seed with scraped data...")
    
    # 1. Seed YouTube Shorts
    shorts_col = get_collection('youtube_shorts')
    shorts_col.delete_many({})
    
    shorts_data = [
        {
            'title': 'Student Admission & Placement Feedback (DSMU Ukraine)',
            'url': 'https://www.youtube.com/shorts/GZoixzGgYNA',
            'is_active': True,
            'display_order': 1,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'title': 'Student Experience & Hostel Tour (Bishkek Kyrgyzstan)',
            'url': 'https://www.youtube.com/shorts/I3JH4adBwUk',
            'is_active': True,
            'display_order': 2,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'title': 'Campus Life & Classroom Seminars (Tbilisi Georgia)',
            'url': 'https://www.youtube.com/shorts/qsRofiNxeRY',
            'is_active': True,
            'display_order': 3,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'title': 'Indian Mess & Food Reviews (Samarkand Uzbekistan)',
            'url': 'https://www.youtube.com/shorts/2m1pOvKRhsU',
            'is_active': True,
            'display_order': 4,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'title': 'University Clinical Rotation highlights (Russia)',
            'url': 'https://www.youtube.com/shorts/JZgeDZOlSl0',
            'is_active': True,
            'display_order': 5,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'title': 'Alumni Success and FMGE Preparation Seminars',
            'url': 'https://www.youtube.com/shorts/7kGQyoaKv5I',
            'is_active': True,
            'display_order': 6,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    ]
    shorts_col.insert_many(shorts_data)
    print(f"Successfully seeded {len(shorts_data)} YouTube Shorts.")

    # 2. Seed Testimonials
    test_col = get_collection('testimonials')
    test_col.delete_many({})
    
    testimonials_data = [
        {
            'name': 'Aditya Sharma',
            'title': 'Dr.',
            'designation': 'MBBS Graduate, Batch 2024',
            'university': 'Bashkir State Medical University',
            'country': 'Russia',
            'photo': '/images/testimonials/avatar1.jpg',
            'quote': 'Studying at Bashkir State Medical University was the best decision of my life. The faculty is extremely supportive and clinical exposure is excellent.',
            'rating': 5,
            'batch_year': '2024',
            'is_active': True,
            'display_order': 1,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Priyesha Patel',
            'title': 'Dr.',
            'designation': 'MD Physician, Batch 2024',
            'university': 'Alte University',
            'country': 'Georgia',
            'photo': '/images/testimonials/avatar2.jpg',
            'quote': 'Georgia offers world-class European medical education. Intermost helped me with documentation and admission seamlessly.',
            'rating': 5,
            'batch_year': '2024',
            'is_active': True,
            'display_order': 2,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Aman Verma',
            'title': 'Dr.',
            'designation': 'MD Candidate, Batch 2025',
            'university': 'Tashkent Medical Academy',
            'country': 'Uzbekistan',
            'photo': '/images/testimonials/avatar3.jpg',
            'quote': 'Uzbekistan has highly affordable medical universities with similar climate and standard facilities. Highly recommended!',
            'rating': 5,
            'batch_year': '2025',
            'is_active': True,
            'display_order': 3,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Aman Gupta',
            'title': 'Dr.',
            'designation': 'MBBS MD (Physician) DSMU, Batch 2020',
            'university': 'Dnipro State Medical University',
            'country': 'Ukraine',
            'photo': '/images/testimonials/avatar1.jpg',
            'quote': 'Pass FMGE Exam: 2020, MBBS MD (Physician) DSMU. Currently PG Resident 3rd year at MS Orthopedics, Mahatma Gandhi memorial govt medical college and hospital, Jamshedpur.',
            'rating': 5,
            'batch_year': '2020',
            'is_active': True,
            'display_order': 4,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Sneha Roy',
            'title': 'Dr.',
            'designation': 'MBBS Graduate, Batch 2018',
            'university': 'Dnipro State Medical University',
            'country': 'Ukraine',
            'photo': '/images/testimonials/avatar2.jpg',
            'quote': 'Dnipro State Medical University (2018 batch) alumnus. Intermost helped me start my journey smoothly and clear my licensure.',
            'rating': 5,
            'batch_year': '2018',
            'is_active': True,
            'display_order': 5,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Vikram Singh',
            'title': 'Dr.',
            'designation': 'GDMO, Batch 2019',
            'university': 'Dnipropetrovsk State Medical University',
            'country': 'Ukraine',
            'photo': '/images/testimonials/avatar3.jpg',
            'quote': '2019 FMGE Passed GDMO at PHC (N) Dengausta, Ganjam, Odisha since 2021. Thank you Intermost team!',
            'rating': 5,
            'batch_year': '2019',
            'is_active': True,
            'display_order': 6,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Priya Nair',
            'title': 'Dr.',
            'designation': 'Resident Surgeon, Batch 2020',
            'university': 'Dnipropetrovsk State Medical University',
            'country': 'Ukraine',
            'photo': '/images/testimonials/avatar1.jpg',
            'quote': 'Dnipropetrovsk State Medical University graduate. Currently Resident - General Surgery, Metro Hospital Faridabad.',
            'rating': 5,
            'batch_year': '2020',
            'is_active': True,
            'display_order': 7,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Rohit Kumar',
            'title': 'Dr.',
            'designation': 'Intern Doctor, Batch 2024',
            'university': 'International Medical University',
            'country': 'Kyrgyzstan',
            'photo': '/images/testimonials/avatar2.jpg',
            'quote': 'Graduated from International Medical University, Bishkek, Kyrgyzstan, currently doing internship. Cleared FMGE 2024!',
            'rating': 5,
            'batch_year': '2024',
            'is_active': True,
            'display_order': 8,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Anjali Patil',
            'title': 'Dr.',
            'designation': 'MD Candidate, Batch 2025',
            'university': 'Georgian National University SEU',
            'country': 'Georgia',
            'photo': '/images/testimonials/avatar3.jpg',
            'quote': 'Georgian National University SEU, Batch 2025 student placed via Intermost Ventures. High quality clinical facilities.',
            'rating': 5,
            'batch_year': '2025',
            'is_active': True,
            'display_order': 9,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Vikas Yadav',
            'title': 'Dr.',
            'designation': 'Resident Physician, Batch 2023',
            'university': 'Mari State University',
            'country': 'Russia',
            'photo': '/images/testimonials/avatar1.jpg',
            'quote': 'Mari State University, Russia alumnus. Working at PARAS Hospital, Tapukhara Bhiwadi, Rajasthan.',
            'rating': 5,
            'batch_year': '2023',
            'is_active': True,
            'display_order': 10,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Deepak Sharma',
            'title': 'Dr.',
            'designation': 'MBBS Graduate, Batch 2024',
            'university': 'Andijan State Medical University',
            'country': 'Uzbekistan',
            'photo': '/images/testimonials/avatar2.jpg',
            'quote': 'Andijan State Medical University, Uzbekistan, Batch 2024. Cleared all licensing tests successfully.',
            'rating': 5,
            'batch_year': '2024',
            'is_active': True,
            'display_order': 11,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    ]
    test_col.insert_many(testimonials_data)
    print(f"Successfully seeded {len(testimonials_data)} Testimonials.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_old_site_data()
