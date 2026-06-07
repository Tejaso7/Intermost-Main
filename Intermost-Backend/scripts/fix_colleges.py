import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.mongodb import get_collection
from bson import ObjectId

colleges = get_collection('colleges')
countries = get_collection('countries')

# Build country lookup
country_map = {}
for country in countries.find():
    country_map[country['slug']] = {
        '_id': str(country['_id']),
        'name': country['name']
    }

print('Countries found:', list(country_map.keys()))

# City mapping for colleges
city_map = {
    'georgia': 'Tbilisi',
    'russia': 'Moscow',
    'kazakhstan': 'Almaty',
    'nepal': 'Kathmandu',
    'uzbekistan': 'Tashkent',
    'vietnam': 'Hanoi',
    'tajikistan': 'Dushanbe',
}

# Update colleges with country info
updated = 0
for college in colleges.find():
    slug = college.get('country_slug', '')
    if slug in country_map:
        country_info = country_map[slug]
        city = city_map.get(slug, country_info['name'])
        
        updates = {
            'country_name': country_info['name'],
            'country_id': country_info['_id']
        }
        
        # Add overview if missing
        if not college.get('overview'):
            updates['overview'] = {
                'location': city,
                'established': 'N/A'
            }
        elif not college.get('overview', {}).get('location'):
            updates['overview.location'] = city
        
        colleges.update_one({'_id': college['_id']}, {'$set': updates})
        updated += 1

print(f'Updated {updated} colleges with country info')

# Verify
sample = colleges.find_one()
print(f"\nSample college after update:")
print(f"Name: {sample.get('name')}")
print(f"Country Name: {sample.get('country_name')}")
print(f"Overview: {sample.get('overview')}")
