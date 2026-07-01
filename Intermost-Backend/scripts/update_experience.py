import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.mongodb import get_collection

def main():
    col = get_collection('site_settings')
    result = col.update_one({'_id': 'main'}, {'$set': {'stats.years_experience': 23}})
    print(f"Update site_settings status. Matches: {result.matched_count}, Modified: {result.modified_count}")

if __name__ == '__main__':
    main()
