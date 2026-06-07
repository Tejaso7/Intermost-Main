"""
College Schema Definition.
This defines the JSON structure for college/university documents in MongoDB.
"""

COLLEGE_SCHEMA = {
    "_id": "ObjectId",
    "name": "string",               # e.g., "Bashkir State Medical University"
    "slug": "string",               # e.g., "bashkir-state-medical-university"
    "country_id": "ObjectId",       # Reference to country
    "country_slug": "string",       # Denormalized for easy queries
    "country_name": "string",       # Denormalized for display
    
    "logo": "string",               # College logo URL
    "banner_image": "string",       # Main banner/hero image
    "thumbnail": "string",          # Thumbnail for cards
    
    "seo": {
        "title": "string",
        "description": "string",
        "keywords": ["string"]
    },
    
    "overview": {
        "short_description": "string",
        "full_description": "string",
        "established_year": "integer",
        "university_type": "string",    # "Government" or "Private"
    },
    
    "contact": {
        "website": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "city": "string",
        "map_url": "string"             # Google Maps embed URL
    },
    
    "recognition": [
        {
            "name": "string",           # e.g., "NMC"
            "logo": "string",
            "verified": "boolean"
        }
    ],
    
    "course_details": {
        "degree": "string",             # e.g., "MBBS / MD"
        "duration": "string",           # e.g., "6 Years"
        "medium": "string",             # e.g., "English"
        "intake": "string",             # e.g., "September / October"
        "seats_available": "integer",
    },
    
    "fees": {
        "tuition_fee_per_year": "string",
        "hostel_fee_per_year": "string",
        "total_package": "string",
        "scholarship_available": "boolean",
        "scholarship_details": "string"
    },
    
    "eligibility": {
        "minimum_percentage": "string",
        "neet_required": "boolean",
        "neet_cutoff": "string",
        "age_limit": "string",
        "documents_required": ["string"]
    },
    
    "facilities": [
        {
            "icon": "string",
            "name": "string",
            "description": "string"
        }
    ],
    
    "highlights": ["string"],           # Key highlights as bullet points
    
    "gallery": [
        {
            "type": "string",           # "image" or "video"
            "url": "string",
            "caption": "string",
            "is_featured": "boolean"
        }
    ],
    
    "rankings": {
        "world_rank": "string",
        "country_rank": "string",
        "other_rankings": ["string"]
    },
    
    "meta": {
        "display_order": "integer",
        "is_active": "boolean",
        "is_featured": "boolean",
        "is_nmc_approved": "boolean",
        "is_who_listed": "boolean",
        "created_at": "datetime",
        "updated_at": "datetime"
    }
}


def get_default_college():
    """Return a default college template."""
    return {
        "name": "",
        "slug": "",
        "country_id": None,
        "country_slug": "",
        "country_name": "",
        "logo": "",
        "banner_image": "",
        "thumbnail": "",
        "seo": {
            "title": "",
            "description": "",
            "keywords": []
        },
        "overview": {
            "short_description": "",
            "full_description": "",
            "established_year": None,
            "university_type": "Government"
        },
        "contact": {
            "website": "",
            "email": "",
            "phone": "",
            "address": "",
            "city": "",
            "map_url": ""
        },
        "recognition": [],
        "course_details": {
            "degree": "MBBS / MD",
            "duration": "6 Years",
            "medium": "English",
            "intake": "September",
            "seats_available": 0
        },
        "fees": {
            "tuition_fee_per_year": "",
            "hostel_fee_per_year": "",
            "total_package": "",
            "scholarship_available": False,
            "scholarship_details": ""
        },
        "eligibility": {
            "minimum_percentage": "50% in PCB",
            "neet_required": True,
            "neet_cutoff": "",
            "age_limit": "17 years minimum",
            "documents_required": [
                "10th Marksheet",
                "12th Marksheet",
                "NEET Scorecard",
                "Passport",
                "Passport Size Photos"
            ]
        },
        "facilities": [],
        "highlights": [],
        "gallery": [],
        "rankings": {
            "world_rank": "",
            "country_rank": "",
            "other_rankings": []
        },
        "meta": {
            "display_order": 0,
            "is_active": True,
            "is_featured": False,
            "is_nmc_approved": True,
            "is_who_listed": True,
            "created_at": None,
            "updated_at": None
        }
    }
