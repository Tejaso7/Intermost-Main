"""
Database Seeding Script - Populates MongoDB with initial data.
Run: python manage.py shell < scripts/seed_data.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.mongodb import get_collection
from datetime import datetime

def seed_countries():
    """Seed countries data."""
    collection = get_collection('countries')
    
    # Clear existing data
    collection.delete_many({})
    
    countries = [
        {
            "name": "Russia",
            "slug": "russia",
            "code": "ru",
            "flag_url": "https://flagcdn.com/w40/ru.png",
            "hero_video": "/video/russia/russia.mp4",
            "hero_image": "/images/countries/russia.jpg",
            "banner_image": "/images/countries/russia.jpg",
            "seo": {
                "title": "MBBS in Russia 2025 - Top Medical Universities | Intermost",
                "description": "Study MBBS in Russia at WHO & NMC approved universities. Low fees, English medium, 6-year program.",
                "keywords": ["MBBS in Russia", "Russia medical universities", "study medicine Russia"]
            },
            "overview": {
                "title": "Why Study MBBS in Russia?",
                "description": "Russia offers globally recognized medical degrees from NMC & WHO-approved universities. With English-taught programs, low tuition fees, and high-quality infrastructure, it's a top choice for international students.",
                "highlights": [
                    {"icon": "fas fa-graduation-cap", "title": "Globally Recognized", "description": "NMC and WHO approved degrees"},
                    {"icon": "fas fa-language", "title": "English Medium", "description": "No language barrier for Indian students"},
                    {"icon": "fas fa-money-bill-wave", "title": "Affordable", "description": "Low tuition fees compared to India"},
                    {"icon": "fas fa-shield-alt", "title": "Safe Environment", "description": "Friendly for international students"}
                ]
            },
            "pricing": {
                "tuition_fee": "$4,000-6,000/year",
                "hostel_fee": "$600-1,200/year",
                "living_cost": "$150-200/month",
                "total_course_fee": "₹25-35 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO", "WFME"]
            },
            "features": [
                {"icon": "fas fa-check-circle", "title": "Globally Recognized", "description": "High-Quality Education"},
                {"icon": "fas fa-check-circle", "title": "English Medium", "description": "No language barrier"}
            ],
            "advantages": [
                "Low Tuition Fees",
                "High-Quality Education",
                "English Medium",
                "Safe Environment"
            ],
            "faqs": [
                {"question": "Is MBBS from Russia valid in India?", "answer": "Yes, MBBS degrees from NMC-approved Russian medical universities are valid in India. After completing your degree, you need to clear the FMGE to practice in India."},
                {"question": "What is the duration of MBBS in Russia?", "answer": "The MBBS program in Russia typically lasts for 6 years, which includes 5 years of academic study and 1 year of internship."},
                {"question": "Is NEET required for MBBS in Russia?", "answer": "Yes, since 2018, NEET qualification is mandatory for Indian students who wish to pursue MBBS abroad."}
            ],
            "gallery": [],
            "meta": {
                "display_order": 1,
                "is_active": True,
                "is_featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Uzbekistan",
            "slug": "uzbekistan",
            "code": "uz",
            "flag_url": "https://flagcdn.com/w40/uz.png",
            "hero_video": "/video/uzbekistan/uzbekistan.mp4",
            "hero_image": "/images/countries/uzbekistan.jpg",
            "banner_image": "/images/countries/uzbekistan.jpg",
            "seo": {
                "title": "MBBS in Uzbekistan 2025 - Affordable Medical Education | Intermost",
                "description": "Study MBBS in Uzbekistan at NMC approved universities. Lowest fees, safe environment, USMLE & NEXT preparation.",
                "keywords": ["MBBS in Uzbekistan", "Uzbekistan medical universities", "affordable MBBS abroad"]
            },
            "overview": {
                "title": "Why Study MBBS in Uzbekistan?",
                "description": "Uzbekistan offers affordable MBBS programs at NMC-approved universities with modern infrastructure and excellent clinical exposure.",
                "highlights": [
                    {"icon": "fas fa-money-bill-wave", "title": "Low Tuition Fees", "description": "Starting from $3,500/year"},
                    {"icon": "fas fa-shield-alt", "title": "Safe Environment", "description": "Welcoming culture for Indian students"},
                    {"icon": "fas fa-book", "title": "USMLE & NEXT Prep", "description": "Focused exam preparation"},
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Recognized in India"}
                ]
            },
            "pricing": {
                "tuition_fee": "$3,500/year",
                "hostel_fee": "$500-800/year",
                "living_cost": "$100-150/month",
                "total_course_fee": "₹20-28 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO"]
            },
            "features": [],
            "advantages": ["Low Tuition Fees", "Safe Environment", "USMLE & NEXT Preparation"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 2,
                "is_active": True,
                "is_featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Georgia",
            "slug": "georgia",
            "code": "ge",
            "flag_url": "https://flagcdn.com/w40/ge.png",
            "hero_video": "/video/georgia/georgia.mp4",
            "hero_image": "/images/countries/georgia.jpg",
            "banner_image": "/images/countries/georgia.jpg",
            "seo": {
                "title": "MBBS in Georgia 2025 - European Medical Education | Intermost",
                "description": "Study MBBS in Georgia with European education standards. USMLE preparation, safe environment.",
                "keywords": ["MBBS in Georgia", "Georgia medical universities", "European medical education"]
            },
            "overview": {
                "title": "Why Study MBBS in Georgia?",
                "description": "Georgia offers European standard medical education with USMLE preparation and a safe, welcoming environment for international students.",
                "highlights": [
                    {"icon": "fas fa-globe-europe", "title": "European Standard", "description": "High-quality education system"},
                    {"icon": "fas fa-book-medical", "title": "USMLE Preparation", "description": "Focused US licensing prep"},
                    {"icon": "fas fa-shield-alt", "title": "Safe Environment", "description": "Low crime, friendly locals"},
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Valid in India"}
                ]
            },
            "pricing": {
                "tuition_fee": "$4,800-8,000/year",
                "hostel_fee": "$1,000-1,500/year",
                "living_cost": "$200-300/month",
                "total_course_fee": "₹30-45 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO", "WFME", "ECFMG"]
            },
            "features": [],
            "advantages": ["USMLE Preparation", "European Education Standard", "Safe Environment"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 3,
                "is_active": True,
                "is_featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Nepal",
            "slug": "nepal",
            "code": "np",
            "flag_url": "https://flagcdn.com/w40/np.png",
            "hero_video": "/video/nepal/nepal.mp4",
            "hero_image": "/images/countries/nepal.jpg",
            "banner_image": "/images/countries/nepal.jpg",
            "seo": {
                "title": "MBBS in Nepal 2025 - Same Indian Curriculum | Intermost",
                "description": "Study MBBS in Nepal at NMC approved universities. No language barrier, same Indian curriculum.",
                "keywords": ["MBBS in Nepal", "Nepal medical universities", "MBBS near India"]
            },
            "overview": {
                "title": "Why Study MBBS in Nepal?",
                "description": "Nepal offers MBBS programs similar to Indian curriculum with no language barrier and close proximity to home.",
                "highlights": [
                    {"icon": "fas fa-home", "title": "Close to Home", "description": "Easy to visit family"},
                    {"icon": "fas fa-language", "title": "No Language Barrier", "description": "Hindi/English medium"},
                    {"icon": "fas fa-book", "title": "Indian Curriculum", "description": "Similar syllabus"},
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Valid in India"}
                ]
            },
            "pricing": {
                "tuition_fee": "₹55 Lakh - Full Course",
                "hostel_fee": "Included",
                "living_cost": "₹8,000-10,000/month",
                "total_course_fee": "₹55-60 Lakhs",
                "currency": "INR"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% in each PCB subject",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard (Current Year)", "₹25 Lakh first installment"]
            },
            "course_details": {
                "duration": "5.5 Years",
                "medium": "English",
                "degree_awarded": "MBBS",
                "recognition": ["NMC"]
            },
            "features": [],
            "advantages": ["NMC Approved", "No Language Barrier", "Same Indian Curriculum"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 4,
                "is_active": True,
                "is_featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Vietnam",
            "slug": "vietnam",
            "code": "vn",
            "flag_url": "https://flagcdn.com/w40/vn.png",
            "hero_video": "/video/vietnam/vietnam.mp4",
            "hero_image": "/images/countries/vietnam.jpg",
            "banner_image": "/images/countries/vietnam.jpg",
            "seo": {
                "title": "MBBS in Vietnam 2025 - Modern Infrastructure | Intermost",
                "description": "Study MBBS in Vietnam with modern infrastructure and affordable fees.",
                "keywords": ["MBBS in Vietnam", "Vietnam medical universities"]
            },
            "overview": {
                "title": "Why Study MBBS in Vietnam?",
                "description": "Vietnam offers modern medical infrastructure and affordable MBBS programs.",
                "highlights": [
                    {"icon": "fas fa-hospital", "title": "Modern Infrastructure", "description": "State-of-the-art facilities"},
                    {"icon": "fas fa-money-bill-wave", "title": "Affordable Tuition", "description": "$4,000/year"},
                    {"icon": "fas fa-shield-alt", "title": "Safe & Friendly", "description": "Welcoming environment"},
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Valid in India"}
                ]
            },
            "pricing": {
                "tuition_fee": "$4,000/year",
                "hostel_fee": "$600-1,000/year",
                "living_cost": "$150-200/month",
                "total_course_fee": "₹22-30 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO"]
            },
            "features": [],
            "advantages": ["Modern Infrastructure", "Affordable Tuition", "Safe & Friendly"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 5,
                "is_active": True,
                "is_featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Tajikistan",
            "slug": "tajikistan",
            "code": "tj",
            "flag_url": "https://flagcdn.com/w40/tj.png",
            "hero_video": "/video/tajikistan/tajikistan.mp4",
            "hero_image": "/images/countries/tajikistan.jpg",
            "banner_image": "/images/countries/tajikistan.jpg",
            "seo": {
                "title": "MBBS in Tajikistan 2025 - Most Affordable | Intermost",
                "description": "Study MBBS in Tajikistan at the most affordable fees. FMGE focused.",
                "keywords": ["MBBS in Tajikistan", "cheapest MBBS abroad"]
            },
            "overview": {
                "title": "Why Study MBBS in Tajikistan?",
                "description": "Tajikistan offers the most affordable MBBS programs with FMGE-focused curriculum.",
                "highlights": [
                    {"icon": "fas fa-coins", "title": "Affordable Living", "description": "Lowest living costs"},
                    {"icon": "fas fa-book-medical", "title": "FMGE Focused", "description": "Exam-oriented preparation"},
                    {"icon": "fas fa-language", "title": "English Medium", "description": "No language barrier"},
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Valid in India"}
                ]
            },
            "pricing": {
                "tuition_fee": "$3,000/year",
                "hostel_fee": "$400-600/year",
                "living_cost": "$80-120/month",
                "total_course_fee": "₹18-25 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO"]
            },
            "features": [],
            "advantages": ["Affordable Living", "FMGE Focused", "English Medium"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 6,
                "is_active": True,
                "is_featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        },
        {
            "name": "Kazakhstan",
            "slug": "kazakhstan",
            "code": "kz",
            "flag_url": "https://flagcdn.com/w40/kz.png",
            "hero_video": "/video/kazakhstan/kazakhstan.mp4",
            "hero_image": "/images/countries/kazakhstan.jpg",
            "banner_image": "/images/countries/kazakhstan.jpg",
            "seo": {
                "title": "MBBS in Kazakhstan 2025 - NMC Approved | Intermost",
                "description": "Study MBBS in Kazakhstan. NMC approved, affordable, Indian food available.",
                "keywords": ["MBBS in Kazakhstan", "Kazakhstan medical universities"]
            },
            "overview": {
                "title": "Why Study MBBS in Kazakhstan?",
                "description": "Kazakhstan offers NMC-approved MBBS programs with affordable fees and Indian food availability.",
                "highlights": [
                    {"icon": "fas fa-certificate", "title": "NMC Approved", "description": "Valid in India"},
                    {"icon": "fas fa-money-bill-wave", "title": "Affordable & Safe", "description": "Budget-friendly"},
                    {"icon": "fas fa-utensils", "title": "Indian Food Available", "description": "Familiar cuisine"},
                    {"icon": "fas fa-language", "title": "English Medium", "description": "No language barrier"}
                ]
            },
            "pricing": {
                "tuition_fee": "$3,500/year",
                "hostel_fee": "$500-800/year",
                "living_cost": "$100-150/month",
                "total_course_fee": "₹20-28 Lakhs",
                "currency": "USD"
            },
            "eligibility": {
                "academic": "10+2 with Physics, Chemistry, Biology",
                "minimum_marks": "50% marks in PCB",
                "neet_required": True,
                "age_requirement": "Minimum 17 years by December 31st",
                "other_requirements": ["Valid Passport", "NEET Scorecard"]
            },
            "course_details": {
                "duration": "6 Years",
                "medium": "English",
                "degree_awarded": "MD (equivalent to MBBS)",
                "recognition": ["NMC", "WHO"]
            },
            "features": [],
            "advantages": ["NMC Approved", "Affordable & Safe", "Indian Food Available"],
            "faqs": [],
            "gallery": [],
            "meta": {
                "display_order": 7,
                "is_active": True,
                "is_featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    ]
    
    result = collection.insert_many(countries)
    print(f"Inserted {len(result.inserted_ids)} countries")
    return result.inserted_ids


def seed_colleges():
    """Seed colleges/universities data from actual HTML files."""
    collection = get_collection('colleges')
    
    # Clear existing data
    collection.delete_many({})
    
    colleges = [
        # RUSSIA UNIVERSITIES
        {
            "name": "Bashkir State Medical University",
            "slug": "bashkir-state-medical-university",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Ufa",
            "established": 1932,
            "image": "/images/russia/bashkir.jpg",
            "logo": "",
            "website": "https://bashgmu.ru/en/",
            "description": "One of the oldest medical institutions in Russia with global recognition.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Moscow Engineering Physics Institute (MEPhI)",
            "slug": "mephi-moscow",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Moscow",
            "established": 1942,
            "image": "/images/russia/mas.jpg",
            "logo": "",
            "website": "https://mephi.ru",
            "description": "Known for its excellence in engineering and medicine, offering world-class education.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Ryazan State Medical University",
            "slug": "ryazan-state-medical-university",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Ryazan",
            "established": 1950,
            "image": "/images/russia/rya.jpg",
            "logo": "",
            "website": "https://en.rsma.ru",
            "description": "Offers high-quality medical education with strong clinical exposure.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Yaroslavi State Medical University",
            "slug": "yaroslavi-state-medical-university",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Yaroslavl Oblast",
            "established": 1944,
            "image": "/images/russia/yaro.jpg",
            "logo": "",
            "website": "https://ysmu.in/",
            "description": "One of the oldest medical institutions in Russia with global recognition.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "North Caucasian State Academy",
            "slug": "north-caucasian-state-academy",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Karachay-Cherkessia",
            "established": 1995,
            "image": "/images/russia/north.jpg",
            "logo": "",
            "website": "https://ncsa.ru/en/",
            "description": "One of the oldest medical institutions in Russia with global recognition.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Ivanono State Medical University",
            "slug": "ivanono-state-medical-university",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Ivanovo Oblast",
            "established": 1930,
            "image": "/images/russia/iva.jpg",
            "logo": "",
            "website": "https://www.ivgmu.com/",
            "description": "One of the oldest medical institutions in Russia with global recognition.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 6,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Voronezh State Medical University",
            "slug": "voronezh-state-medical-university",
            "country": "Russia",
            "country_slug": "russia",
            "city": "Voronezh",
            "established": 1918,
            "image": "/images/russia/var.jpg",
            "logo": "",
            "website": "https://vsmu.ru",
            "description": "Offers excellent infrastructure and research facilities for aspiring doctors.",
            "tuition_fee": "$4,000-6,000/year",
            "hostel_fee": "$600-1,200/year",
            "total_fee": "$35,000-45,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 7,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # GEORGIA UNIVERSITIES
        {
            "name": "Caucasus University",
            "slug": "caucasus-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 1998,
            "image": "/images/georgia/caucasus.jpg",
            "logo": "",
            "website": "",
            "description": "Private university in Tbilisi offering NMC-approved MBBS with modern facilities.",
            "tuition_fee": "$5,500/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$48,000-51,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "East European University",
            "slug": "east-european-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 2012,
            "image": "/images/georgia/east.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on practical medical training with international partnerships.",
            "tuition_fee": "$5,500/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$48,000-51,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "International Black Sea University",
            "slug": "international-black-sea-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 1995,
            "image": "/images/georgia/gnuu.webp",
            "logo": "",
            "website": "",
            "description": "Focus on practical medical training with international partnerships.",
            "tuition_fee": "$4,800/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$43,800-48,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Alte University",
            "slug": "alte-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 2014,
            "image": "/images/georgia/altee.jpg",
            "logo": "",
            "website": "",
            "description": "Affordable English-medium MBBS program with strong clinical exposure.",
            "tuition_fee": "$5,500/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$48,000-51,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Georgian National University (SEU)",
            "slug": "georgian-national-university-seu",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 2001,
            "image": "/images/georgia/gnu.jpg",
            "logo": "",
            "website": "",
            "description": "Modern infrastructure with European-standard medical education.",
            "tuition_fee": "$5,500/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$48,000-51,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Batumi International University",
            "slug": "batumi-international-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Batumi",
            "established": 2012,
            "image": "/images/georgia/bau.jpg",
            "logo": "",
            "website": "",
            "description": "Coastal university with modern campus and international faculty.",
            "tuition_fee": "$4,800/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$43,800-48,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 6,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Tbilisi State Medical University",
            "slug": "tbilisi-state-medical-university",
            "country": "Georgia",
            "country_slug": "georgia",
            "city": "Tbilisi",
            "established": 1918,
            "image": "/images/georgia/tib.jpg",
            "logo": "",
            "website": "",
            "description": "Georgia's Biggest medical Universities offering European Standard.",
            "tuition_fee": "$8,000/year",
            "hostel_fee": "$2,500-3,000/year",
            "total_fee": "$63,000-66,000 (6 years)",
            "other_cost": "$200 - TRC & Documentation",
            "living_cost": "$200-300/month",
            "recognitions": ["NMC", "FAIMER", "USMLE", "WFME", "ECFMG", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 7,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # NEPAL UNIVERSITIES
        {
            "name": "Devdaha Medical College & Research Institute",
            "slug": "devdaha-medical-college",
            "country": "Nepal",
            "country_slug": "nepal",
            "city": "Devdaha",
            "established": 2010,
            "image": "/images/nepal/dev.jpg",
            "logo": "",
            "website": "",
            "description": "Premier medical institution with international collaborations and modern facilities.",
            "tuition_fee": "₹50 Lakh (Entire MBBS Course)",
            "first_installment": "₹25 Lakh",
            "hostel_fee": "₹10-12 Lakh (Entire MBBS Course)",
            "total_fee": "₹60-62 Lakh (Total)",
            "living_cost": "Included",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "5.5 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "B&C Medical College Teaching Hospital & Research Center",
            "slug": "bc-medical-college",
            "country": "Nepal",
            "country_slug": "nepal",
            "city": "Jhapa",
            "established": 2008,
            "image": "/images/nepal/bc.jpg",
            "logo": "",
            "website": "",
            "description": "Nepal's oldest university with 60+ Years of medical education legacy.",
            "tuition_fee": "₹55 Lakh (Entire MBBS Course)",
            "first_installment": "₹25 Lakh",
            "hostel_fee": "₹10-12 Lakh (Entire MBBS Course)",
            "total_fee": "₹65-67 Lakh (Total)",
            "living_cost": "Included",
            "recognitions": ["NMC", "MEC"],
            "course_duration": "5.5 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Chitwan Medical College & Hospital",
            "slug": "chitwan-medical-college",
            "country": "Nepal",
            "country_slug": "nepal",
            "city": "Chitwan",
            "established": 2006,
            "image": "/images/nepal/chitwan.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "₹60 Lakh (Entire MBBS Course)",
            "first_installment": "₹25 Lakh",
            "hostel_fee": "Included in tuition",
            "mess_fee": "₹2.75-3 Lakh (Entire MBBS Course)",
            "total_fee": "₹62.75-63 Lakh (Total)",
            "discount": "₹3 Lakh discount if 200+ marks in NEET",
            "living_cost": "Included",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "5.5 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Kathmandu Medical College & Hospital",
            "slug": "kathmandu-medical-college",
            "country": "Nepal",
            "country_slug": "nepal",
            "city": "Kathmandu",
            "established": 1997,
            "image": "/images/nepal/kat.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "₹50 Lakh (Entire MBBS Course)",
            "first_installment": "₹25 Lakh",
            "hostel_fee": "₹8-10 Lakh (Entire MBBS Course)",
            "total_fee": "₹58-60 Lakh (Total)",
            "living_cost": "Included",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "5.5 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Janaki Medical College & Teaching Hospital",
            "slug": "janaki-medical-college",
            "country": "Nepal",
            "country_slug": "nepal",
            "city": "Janakpur",
            "established": 2003,
            "image": "/images/nepal/janaki.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "₹5-8 Lakh (Entire MBBS Course)",
            "first_installment": "₹25 Lakh",
            "hostel_fee": "₹2.5-3 Lakh (Entire MBBS Course)",
            "total_fee": "₹7.5-11 Lakh (Total)",
            "living_cost": "Included",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "5.5 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # UZBEKISTAN UNIVERSITIES
        {
            "name": "Andijan State Medical University",
            "slug": "andijan-state-medical-university",
            "country": "Uzbekistan",
            "country_slug": "uzbekistan",
            "city": "Andijan",
            "established": 1955,
            "image": "/images/uzbekistan/uz1.jpg",
            "logo": "",
            "website": "http://www.adti.uz",
            "address": "Yu. Otabekov 1, Andijan city",
            "description": "Established in 1955, offering quality medical education with global recognition.",
            "tuition_fee": "$3,500-4,500/year",
            "hostel_fee": "$3,000/year",
            "total_fee": "$39,000-45,000 (6 years)",
            "living_cost": "$100-150/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Tashkent State Medical University",
            "slug": "tashkent-state-medical-university",
            "country": "Uzbekistan",
            "country_slug": "uzbekistan",
            "city": "Tashkent",
            "established": 1920,
            "image": "/images/uzbekistan/uz2.jpg",
            "logo": "",
            "website": "https://tma.uz/en/",
            "description": "Prestigious university located in the capital city, known for its strong academic curriculum.",
            "tuition_fee": "$3,500-4,500/year",
            "hostel_fee": "$3,000/year",
            "total_fee": "$39,000-45,000 (6 years)",
            "living_cost": "$100-150/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Samarkand State Medical Institute",
            "slug": "samarkand-state-medical-institute",
            "country": "Uzbekistan",
            "country_slug": "uzbekistan",
            "city": "Samarkand",
            "established": 1930,
            "image": "/images/uzbekistan/uz3.jpg",
            "logo": "",
            "website": "https://www.sammu.uz/en",
            "description": "Historic university offering modern medical education in a culturally rich city.",
            "tuition_fee": "$3,500-4,500/year",
            "hostel_fee": "$3,000/year",
            "total_fee": "$39,000-45,000 (6 years)",
            "living_cost": "$100-150/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Bukhara State Medical Institute",
            "slug": "bukhara-state-medical-institute",
            "country": "Uzbekistan",
            "country_slug": "uzbekistan",
            "city": "Bukhara",
            "established": 1990,
            "image": "/images/uzbekistan/uz4.jpg",
            "logo": "",
            "website": "https://bsmiuz.com/",
            "description": "Known for its traditional values and modern teaching techniques in a UNESCO World Heritage City.",
            "tuition_fee": "$3,500-4,500/year",
            "hostel_fee": "$3,000/year",
            "total_fee": "$39,000-45,000 (6 years)",
            "living_cost": "$100-150/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Fergana Medical Institute of Public Health",
            "slug": "fergana-medical-institute",
            "country": "Uzbekistan",
            "country_slug": "uzbekistan",
            "city": "Fergana",
            "established": 1991,
            "image": "/images/uzbekistan/uz5.jpg",
            "logo": "",
            "website": "https://www.fmiph.uz/",
            "description": "Specializes in public health and preventive medicine programs.",
            "tuition_fee": "$3,500-4,500/year",
            "hostel_fee": "$3,000/year",
            "total_fee": "$39,000-45,000 (6 years)",
            "living_cost": "$100-150/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # VIETNAM UNIVERSITIES
        {
            "name": "Dai Nam University",
            "slug": "dai-nam-university",
            "country": "Vietnam",
            "country_slug": "vietnam",
            "city": "Hanoi",
            "established": 2007,
            "image": "/images/vietnam/dai.jpg",
            "logo": "",
            "website": "",
            "description": "Premier medical institution with international collaborations and modern facilities.",
            "tuition_fee": "$6,000-7,000/year",
            "hostel_fee": "$1,200-1,500/year",
            "total_fee": "$43,200-51,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Can Tho University",
            "slug": "can-tho-university",
            "country": "Vietnam",
            "country_slug": "vietnam",
            "city": "Can Tho",
            "established": 1966,
            "image": "/images/vietnam/can.jpg",
            "logo": "",
            "website": "",
            "description": "Vietnam's oldest university of medical education legacy.",
            "tuition_fee": "$6,500-7,000/year",
            "hostel_fee": "$1,200-1,500/year",
            "total_fee": "$46,200-51,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "MEC"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Phan Chau Trinh University",
            "slug": "phan-chau-trinh-university",
            "country": "Vietnam",
            "country_slug": "vietnam",
            "city": "Da Nang",
            "established": 2007,
            "image": "/images/vietnam/phan.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$7,000-8,000/year",
            "hostel_fee": "$1,000-1,400/year",
            "total_fee": "$48,000-56,400 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Ho Chi Minh City University",
            "slug": "ho-chi-minh-city-university",
            "country": "Vietnam",
            "country_slug": "vietnam",
            "city": "Ho Chi Minh City",
            "established": 1947,
            "image": "/images/vietnam/ho.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$8,000-9,000/year",
            "hostel_fee": "$1,500-2,000/year",
            "total_fee": "$57,000-66,000 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Hanoi Medical University",
            "slug": "hanoi-medical-university",
            "country": "Vietnam",
            "country_slug": "vietnam",
            "city": "Hanoi",
            "established": 1902,
            "image": "/images/vietnam/hanoi.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$6,000-6,500/year",
            "hostel_fee": "$1,000-1,400/year",
            "total_fee": "$42,000-47,400 (6 years)",
            "living_cost": "$150-200/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # TAJIKISTAN UNIVERSITIES
        {
            "name": "Tajik National University",
            "slug": "tajik-national-university",
            "country": "Tajikistan",
            "country_slug": "tajikistan",
            "city": "Dushanbe",
            "established": 1947,
            "image": "/images/tajik/tajik.jpg",
            "logo": "",
            "website": "",
            "description": "Premier medical institution with international collaborations and modern facilities.",
            "tuition_fee": "$6,000-7,000/year",
            "hostel_fee": "$1,200-1,500/year",
            "total_fee": "$43,200-51,000 (6 years)",
            "living_cost": "$80-120/month",
            "recognitions": ["NMC", "WHO"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        
        # KAZAKHSTAN UNIVERSITIES
        {
            "name": "Al-Farabi Kazakh National University",
            "slug": "al-farabi-kazakh-national-university",
            "country": "Kazakhstan",
            "country_slug": "kazakhstan",
            "city": "Almaty",
            "established": 1934,
            "image": "/images/Kazakhstan/alf.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$4,681/year",
            "hostel_fee": "$600-800/year",
            "mess_fee": "$120/month",
            "registration_fee": "$250",
            "total_fee": "$31,686-35,286 (6 years)",
            "living_cost": "$120/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Kazakh National Medical University",
            "slug": "kazakh-national-medical-university",
            "country": "Kazakhstan",
            "country_slug": "kazakhstan",
            "city": "Almaty",
            "established": 1930,
            "image": "/images/Kazakhstan/kazak.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$6,383/year",
            "hostel_fee": "$800-1,200/year",
            "mess_fee": "$120/month",
            "registration_fee": "$250",
            "total_fee": "$43,098-48,498 (6 years)",
            "living_cost": "$120/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": True,
            "is_active": True,
            "display_order": 2,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Kazakh-Russian Medical University",
            "slug": "kazakh-russian-medical-university",
            "country": "Kazakhstan",
            "country_slug": "kazakhstan",
            "city": "Almaty",
            "established": 1992,
            "image": "/images/Kazakhstan/kaz-r.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$4,500/year",
            "hostel_fee": "$800-900/year",
            "mess_fee": "$120/month",
            "registration_fee": "$250",
            "total_fee": "$31,800-32,400 (6 years)",
            "living_cost": "$120/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 3,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "West Kazakhstan Marat Ospanov State Medical University",
            "slug": "west-kazakhstan-medical-university",
            "country": "Kazakhstan",
            "country_slug": "kazakhstan",
            "city": "Aktobe",
            "established": 1957,
            "image": "/images/Kazakhstan/west.jpg",
            "logo": "",
            "website": "",
            "description": "Focus on community medicine and practical healthcare training.",
            "tuition_fee": "$3,700/year",
            "hostel_fee": "$600-800/year",
            "mess_fee": "$120/month",
            "registration_fee": "$250",
            "total_fee": "$25,800-27,000 (6 years)",
            "living_cost": "$120/month",
            "recognitions": ["NMC", "FAIMER"],
            "course_duration": "6 Years",
            "medium": "English",
            "is_featured": False,
            "is_active": True,
            "display_order": 4,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = collection.insert_many(colleges)
    print(f"Inserted {len(result.inserted_ids)} colleges/universities")
    return result.inserted_ids


def seed_site_settings():
    """Seed site settings."""
    collection = get_collection('site_settings')
    
    settings = {
        '_id': 'main',
        'site_name': 'Intermost Study Abroad',
        'tagline': 'Your Gateway to Global Medical Education',
        'logo': '/images/logo/logo.png',
        'contact': {
            'email': 'admissionintermost@gmail.com',
            'phone': '+91-9058501818',
            'whatsapp': '+91-9058501818',
            'address': 'Shop no -1, First floor, Vinayak Mall, Agra, 282002 (U.P), India'
        },
        'social': {
            'facebook': 'http://facebook.com/intermoststudyabr0ad',
            'instagram': 'https://www.instagram.com/intermoststudyabroad/',
            'youtube': 'http://www.youtube.com/@IntermostStudyAbroad',
            'whatsapp': 'https://wa.me/919058501818'
        },
        'seo': {
            'title': 'Intermost Ventures Study Abroad - MBBS Overseas Education Consultants',
            'description': 'Get guaranteed MBBS admission in WHO & NMC approved medical universities abroad.',
            'keywords': 'MBBS abroad, MBBS overseas, study MBBS abroad, medical universities abroad'
        },
        'stats': {
            'students_placed': 5500,
            'partner_universities': 35,
            'years_experience': 21,
            'visa_success_rate': 99
        },
        'updated_at': datetime.utcnow()
    }
    
    collection.replace_one({'_id': 'main'}, settings, upsert=True)
    print("Site settings seeded")


def seed_team_members():
    """Seed team members."""
    collection = get_collection('team_members')
    collection.delete_many({})
    
    members = [
        {
            'name': 'Mr. Nilesh Kulkarni',
            'title': 'Mr.',
            'designation': 'President of Intermost India',
            'region': 'India',
            'photo': '',
            'phone': '+91 91583 74434',
            'email': 'admissionintermost@gmail.com',
            'bio': 'Study Abroad President with expertise in European universities.',
            'is_active': True,
            'display_order': 1,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Mr. Vinay Singh',
            'title': 'Mr.',
            'designation': 'Uttar Pradesh Head, India',
            'region': 'Uttar Pradesh',
            'photo': '',
            'phone': '+91 90585 01818',
            'email': 'admissionintermost@gmail.com',
            'bio': 'Education Consultant specializing in international student admissions.',
            'is_active': True,
            'display_order': 2,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Dr. Nikhil Chauhan',
            'title': 'Dr.',
            'designation': 'Punjab - Himachal Pradesh Head, India',
            'region': 'Punjab',
            'photo': '',
            'phone': '+91 98880 13647',
            'email': 'admissionintermost@gmail.com',
            'bio': 'Medical Career Advisor with 10+ years of experience.',
            'is_active': True,
            'display_order': 3,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    ]
    
    result = collection.insert_many(members)
    print(f"Inserted {len(result.inserted_ids)} team members")


def seed_offices():
    """Seed office locations."""
    collection = get_collection('offices')
    collection.delete_many({})
    
    offices = [
        {
            'name': 'Head Office - UAE',
            'company_name': 'Ekam Marketing and Innovation Solutions FZ-LLC',
            'address': 'UAE Office',
            'city': 'Dubai',
            'country': 'UAE',
            'phone': '+971542183166',
            'email': 'admissionintermost@gmail.com',
            'is_head_office': True,
            'is_active': True,
            'display_order': 1,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'India Head Office',
            'company_name': 'INTERMOST VENTURES LLP',
            'address': 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road',
            'city': 'Agra',
            'state': 'Uttar Pradesh',
            'pincode': '282002',
            'country': 'India',
            'phone': '+91-9058501818',
            'email': 'admissionintermost@gmail.com',
            'is_head_office': False,
            'is_active': True,
            'display_order': 2,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'India Delhi Office',
            'company_name': 'INTERMOST VENTURES LLP',
            'address': '3 G.F., B.D Chamber, 10/54, Desh Bandhu Gupta Road, Karol Bagh',
            'city': 'New Delhi',
            'state': 'Delhi',
            'pincode': '110005',
            'country': 'India',
            'phone': '+91 9837533887',
            'email': 'admissionintermost@gmail.com',
            'is_head_office': False,
            'is_active': True,
            'display_order': 3,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    ]
    
    result = collection.insert_many(offices)
    print(f"Inserted {len(result.inserted_ids)} offices")


if __name__ == '__main__':
    print("Starting database seeding...")
    seed_countries()
    seed_colleges()
    seed_site_settings()
    seed_team_members()
    seed_offices()
    print("Database seeding completed!")
