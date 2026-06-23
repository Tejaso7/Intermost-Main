import os
import sys
import logging
from pymongo import MongoClient
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.mongodb import get_collection, get_db

def seed_team_and_offices():
    db = get_db()
    if db is None:
        logger.error("Failed to connect to MongoDB")
        return
        
    team_collection = get_collection('team_members')
    offices_collection = get_collection('offices')

    # Hardcoded team members
    team_members = [
      {
        'name': 'Mr. Nilesh Kulkarni',
        'designation': 'President of Intermost India',
        'bio': 'Study Abroad President with expertise in European universities.',
        'phone': '+91 91583 74434',
        'region': 'India',
        'is_active': True,
        'display_order': 1
      },
      {
        'name': 'Mr. Vinay Singh',
        'designation': 'Uttar Pradesh Head, India',
        'bio': 'Education Consultant specializing in international student admissions.',
        'phone': '+91 90585 01818',
        'region': 'Uttar Pradesh',
        'is_active': True,
        'display_order': 2
      },
      {
        'name': 'Dr. Nikhil Chauhan',
        'designation': 'Punjab - Himachal Pradesh Head',
        'bio': 'Medical Career Advisor with 10+ years of experience.',
        'phone': '+91 98880 13647',
        'region': 'Punjab',
        'is_active': True,
        'display_order': 3
      },
      {
        'name': 'Dr. Mohit Gurra',
        'designation': 'Haryana Head, India',
        'bio': 'Career Development Specialist for STEM fields.',
        'phone': '+91 88140 47009',
        'region': 'Haryana',
        'is_active': True,
        'display_order': 4
      },
      {
        'name': 'Dr. Dibya Giri Ranjan',
        'designation': 'Odisha Head, India',
        'bio': 'Career Development Specialist for STEM fields.',
        'phone': '+91 97763 63007',
        'region': 'Odisha',
        'is_active': True,
        'display_order': 5
      },
      {
        'name': 'Dr. Nilutpal Mondal',
        'designation': 'West Bengal Head, India',
        'bio': 'Career Development Specialist for STEM fields.',
        'phone': '+91 96352 20301',
        'region': 'West Bengal',
        'is_active': True,
        'display_order': 6
      },
      {
        'name': 'Dr. Rahul Gautam',
        'designation': 'Delhi - NCR Head, India',
        'bio': 'Career Development Specialist for STEM fields.',
        'phone': '+91 98375 33887',
        'region': 'Delhi',
        'is_active': True,
        'display_order': 7
      },
    ]

    # Hardcoded offices
    offices = [
      {
        'name': 'Head Office - UAE',
        'company_name': 'Ekam Marketing and Innovation Solutions FZ-LLC',
        'address': 'UAE',
        'city': 'UAE',
        'country': 'UAE',
        'phone': '+971 542183166',
        'email': 'admissionintermost@gmail.com',
        'is_head_office': True,
        'is_active': True,
        'display_order': 1
      },
      {
        'name': 'India Head Office',
        'company_name': 'Intermost Ventures LLP',
        'address': 'Shop no -1, First floor, Vinayak Mall, Deewani Crossing (Lotus Hospital Building), M G Road Agra, 282002 (U.P), India',
        'city': 'Agra',
        'country': 'India',
        'pincode': '282002',
        'phone': '+91 9058501818',
        'email': 'admissionintermost@gmail.com',
        'is_head_office': True,
        'is_active': True,
        'display_order': 2
      },
      {
        'name': 'India Delhi Office',
        'company_name': 'Intermost Ventures LLP',
        'address': '3 G.F., B.D Chamber, 10/54, Desh Bandhu Gupta Road, Karol Bagh, New Delhi - 110005',
        'city': 'New Delhi',
        'country': 'India',
        'pincode': '110005',
        'phone': '+91 9837533887',
        'email': 'admissionintermost@gmail.com',
        'is_head_office': False,
        'is_active': True,
        'display_order': 3
      },
      {
        'name': 'India Kerala Office',
        'company_name': 'Intermost Ventures LLP',
        'address': 'C/O KlickEdu, 1st Floor, MS Building, behind New Theatre, Aristo, Thampanoor, Thiruvananthapuram, Kerala, 695012',
        'city': 'Thiruvananthapuram',
        'state': 'Kerala',
        'country': 'India',
        'pincode': '695012',
        'phone': '+91 8111996000',
        'email': 'admissionintermost@gmail.com',
        'is_head_office': False,
        'is_active': True,
        'display_order': 4
      },
      {
        'name': 'India Jodhpur Office',
        'company_name': 'Intermost Ventures LLP',
        'address': 'C/O H.K.Hi-Tech College 4-7, Above Reliance Smart Point, Main PAL Road Jodhpur-342008',
        'city': 'Jodhpur',
        'country': 'India',
        'pincode': '342008',
        'phone': '+91 6367644472',
        'email': 'admissionintermost@gmail.com',
        'is_head_office': False,
        'is_active': True,
        'display_order': 5
      },
    ]

    logger.info(f"Adding {len(team_members)} team members...")
    for member in team_members:
        # Check if exists
        if not team_collection.find_one({'name': member['name']}):
            member['created_at'] = datetime.utcnow()
            member['updated_at'] = datetime.utcnow()
            team_collection.insert_one(member)
            logger.info(f"Added member: {member['name']}")
        else:
            logger.info(f"Member {member['name']} already exists, skipping")

    logger.info(f"Adding {len(offices)} offices...")
    for office in offices:
        # Check if exists
        if not offices_collection.find_one({'name': office['name']}):
            office['created_at'] = datetime.utcnow()
            office['updated_at'] = datetime.utcnow()
            offices_collection.insert_one(office)
            logger.info(f"Added office: {office['name']}")
        else:
            logger.info(f"Office {office['name']} already exists, skipping")
            
    logger.info("Seeding completed successfully!")

if __name__ == "__main__":
    seed_team_and_offices()
