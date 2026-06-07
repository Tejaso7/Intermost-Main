"""
Country Schema Definition.
This defines the JSON structure for country documents in MongoDB.
"""

COUNTRY_SCHEMA = {
    "_id": "ObjectId",
    "name": "string",           # e.g., "Russia"
    "slug": "string",           # e.g., "russia"
    "code": "string",           # e.g., "ru" (ISO code for flags)
    "flag_url": "string",       # e.g., "https://flagcdn.com/w40/ru.png"
    "hero_video": "string",     # Video URL for hero section
    "hero_image": "string",     # Fallback image
    "banner_image": "string",   # Banner/thumbnail image
    
    "seo": {
        "title": "string",
        "description": "string",
        "keywords": ["string"]
    },
    
    "overview": {
        "title": "string",      # e.g., "Why Study MBBS in Russia?"
        "description": "string",
        "highlights": [
            {
                "icon": "string",   # Font Awesome icon class
                "title": "string",
                "description": "string"
            }
        ]
    },
    
    "pricing": {
        "tuition_fee": "string",        # e.g., "$4,000-6,000/year"
        "hostel_fee": "string",         # e.g., "$600-1,200/year"
        "living_cost": "string",        # e.g., "$150-200/month"
        "total_course_fee": "string",   # e.g., "₹25-35 Lakhs"
        "currency": "string"            # e.g., "USD"
    },
    
    "eligibility": {
        "academic": "string",           # e.g., "10+2 with Physics, Chemistry, Biology"
        "minimum_marks": "string",      # e.g., "50% marks in PCB"
        "neet_required": "boolean",
        "age_requirement": "string",    # e.g., "Minimum 17 years by December 31st"
        "other_requirements": ["string"]
    },
    
    "course_details": {
        "duration": "string",           # e.g., "6 Years"
        "medium": "string",             # e.g., "English"
        "degree_awarded": "string",     # e.g., "MD (equivalent to MBBS)"
        "recognition": ["string"]       # e.g., ["NMC", "WHO", "WFME"]
    },
    
    "features": [
        {
            "icon": "string",
            "title": "string",
            "description": "string"
        }
    ],
    
    "advantages": ["string"],           # List of advantages
    
    "faqs": [
        {
            "question": "string",
            "answer": "string"
        }
    ],
    
    "gallery": [
        {
            "type": "string",           # "image" or "video"
            "url": "string",
            "caption": "string"
        }
    ],
    
    "meta": {
        "display_order": "integer",
        "is_active": "boolean",
        "is_featured": "boolean",
        "created_at": "datetime",
        "updated_at": "datetime"
    }
}


def get_default_country():
    """Return a default country template."""
    return {
        "name": "",
        "slug": "",
        "code": "",
        "flag_url": "",
        "hero_video": "",
        "hero_image": "",
        "banner_image": "",
        "seo": {
            "title": "",
            "description": "",
            "keywords": []
        },
        "overview": {
            "title": "",
            "description": "",
            "highlights": []
        },
        "pricing": {
            "tuition_fee": "",
            "hostel_fee": "",
            "living_cost": "",
            "total_course_fee": "",
            "currency": "USD"
        },
        "eligibility": {
            "academic": "10+2 with Physics, Chemistry, Biology",
            "minimum_marks": "50% marks in PCB",
            "neet_required": True,
            "age_requirement": "Minimum 17 years by December 31st",
            "other_requirements": []
        },
        "course_details": {
            "duration": "6 Years",
            "medium": "English",
            "degree_awarded": "MD (equivalent to MBBS)",
            "recognition": ["NMC", "WHO"]
        },
        "features": [],
        "advantages": [],
        "faqs": [],
        "gallery": [],
        "meta": {
            "display_order": 0,
            "is_active": True,
            "is_featured": False,
            "created_at": None,
            "updated_at": None
        }
    }
