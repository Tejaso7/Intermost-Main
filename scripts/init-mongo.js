// MongoDB initialization script
// Creates initial database and collections

db = db.getSiblingDB('intermost_db');

// Create collections
db.createCollection('countries');
db.createCollection('colleges');
db.createCollection('blogs');
db.createCollection('inquiries');
db.createCollection('testimonials');
db.createCollection('news');
db.createCollection('team');
db.createCollection('analytics');
db.createCollection('uploads');

// Create indexes for better query performance
db.countries.createIndex({ 'slug': 1 }, { unique: true });
db.countries.createIndex({ 'meta.is_active': 1 });
db.countries.createIndex({ 'meta.is_featured': 1 });

db.colleges.createIndex({ 'slug': 1 }, { unique: true });
db.colleges.createIndex({ 'country_id': 1 });
db.colleges.createIndex({ 'meta.is_active': 1 });

db.blogs.createIndex({ 'slug': 1 }, { unique: true });
db.blogs.createIndex({ 'category': 1 });
db.blogs.createIndex({ 'is_published': 1 });
db.blogs.createIndex({ 'published_at': -1 });

db.inquiries.createIndex({ 'email': 1 });
db.inquiries.createIndex({ 'status': 1 });
db.inquiries.createIndex({ 'created_at': -1 });
db.inquiries.createIndex({ 'preferred_country': 1 });

db.testimonials.createIndex({ 'is_active': 1 });
db.testimonials.createIndex({ 'created_at': -1 });

db.news.createIndex({ 'published_at': -1 });
db.news.createIndex({ 'is_active': 1 });

db.analytics.createIndex({ 'date': 1 });
db.analytics.createIndex({ 'user_ip': 1 });
db.analytics.createIndex({ 'event_type': 1 });

db.uploads.createIndex({ 'upload_date': -1 });
db.uploads.createIndex({ 'category': 1 });

print('✓ Collections and indexes created successfully');
