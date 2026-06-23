import os
import sys
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.mongodb import get_collection, get_db

def seed_blogs():
    db = get_db()
    if db is None:
        logger.error("Failed to connect to MongoDB")
        return
        
    collection = get_collection('blogs')

    blogs = [
      {
        'title': 'Why Choose Russia for MBBS in 2024?',
        'slug': 'why-choose-russia-mbbs-2024',
        'excerpt': 'Russia offers world-class medical education at affordable costs. Learn why thousands of Indian students choose Russian medical universities every year.',
        'content': '''<h2>Introduction</h2>
      <p>Russia has emerged as one of the top destinations for Indian students seeking quality medical education abroad. With over 50 years of history in training international medical professionals, Russian universities offer a unique combination of quality education, affordable fees, and global recognition.</p>
      
      <h2>Why Russian Medical Universities Stand Out</h2>
      <p>Russian medical universities are recognized by major international bodies including WHO, NMC (formerly MCI), and UNESCO. This ensures that graduates can practice medicine in India and many other countries around the world.</p>
      
      <h3>Key Advantages:</h3>
      <ul>
        <li><strong>Affordable Tuition:</strong> Compared to private medical colleges in India, Russian universities offer significantly lower fees without compromising on quality.</li>
        <li><strong>No Donation or Capitation Fee:</strong> Admission is purely merit-based with no hidden costs.</li>
        <li><strong>English Medium:</strong> Many universities offer complete MBBS programs in English.</li>
        <li><strong>World-Class Infrastructure:</strong> Modern laboratories, well-equipped hospitals, and advanced research facilities.</li>
        <li><strong>Clinical Exposure:</strong> Students get hands-on experience from the early years of their course.</li>
      </ul>
      
      <h2>Top Medical Universities in Russia</h2>
      <p>Some of the most popular choices among Indian students include:</p>
      <ol>
        <li>Kazan Federal University</li>
        <li>Peoples' Friendship University (RUDN)</li>
        <li>First Moscow State Medical University</li>
        <li>Crimea Federal University</li>
        <li>Kursk State Medical University</li>
      </ol>
      
      <h2>Admission Process</h2>
      <p>The admission process for MBBS in Russia is straightforward:</p>
      <ol>
        <li>Check eligibility (NEET qualified, 50% in PCB)</li>
        <li>Choose your preferred university</li>
        <li>Submit application with required documents</li>
        <li>Receive invitation letter</li>
        <li>Apply for student visa</li>
        <li>Travel to Russia and begin your journey</li>
      </ol>
      
      <h2>Cost of Studying MBBS in Russia</h2>
      <p>The total cost including tuition, hostel, and living expenses typically ranges from ₹25-40 lakhs for the entire 6-year program. This is significantly lower than private medical colleges in India.</p>
      
      <h2>Conclusion</h2>
      <p>Russia offers an excellent opportunity for aspiring doctors to receive quality medical education at affordable costs. With proper guidance and preparation, studying MBBS in Russia can be the first step towards a successful medical career.</p>''',
        'featured_image': '/images/countries/russia.jpg',
        'category': 'Russia',
        'author': 'Dr. Amit Kumar',
        'read_time': '5 min read',
        'is_published': True,
        'is_featured': True,
        'tags': ['Russia', 'MBBS', 'Medical Education', 'Study Abroad'],
        'views': 0
      },
      {
        'title': 'NEET Requirements for Studying MBBS Abroad',
        'slug': 'neet-requirements-mbbs-abroad',
        'excerpt': 'Understand the NEET score requirements for Indian students planning to pursue MBBS in foreign countries. Complete guide with eligibility criteria.',
        'content': '<p>Here is a complete guide to NEET requirements for studying MBBS abroad...</p>',
        'featured_image': '/images/news/fair.jpg',
        'category': 'Guide',
        'author': 'Counseling Team',
        'read_time': '8 min read',
        'is_published': True,
        'is_featured': False,
        'tags': ['NEET', 'Eligibility', 'Guide'],
        'views': 0
      },
      {
        'title': 'Top Medical Universities in Georgia 2024',
        'slug': 'top-medical-universities-georgia-2024',
        'excerpt': 'Explore the best medical universities in Georgia offering quality MBBS education with international recognition and affordable fees.',
        'content': '<p>Georgia has rapidly become a premier hub for international medical students...</p>',
        'featured_image': '/images/countries/georgia.jpg',
        'category': 'Georgia',
        'author': 'Dr. Priya Singh',
        'read_time': '6 min read',
        'is_published': True,
        'is_featured': False,
        'tags': ['Georgia', 'MBBS', 'Universities'],
        'views': 0
      },
      {
        'title': 'Student Life in Uzbekistan: A Complete Guide',
        'slug': 'student-life-uzbekistan-guide',
        'excerpt': 'Discover what life is like for Indian medical students in Uzbekistan. From accommodation to food and culture, everything you need to know.',
        'content': '<p>Uzbekistan offers a unique and welcoming environment for Indian medical students...</p>',
        'featured_image': '/images/countries/uzbekistan.jpg',
        'category': 'Uzbekistan',
        'author': 'Alumni Network',
        'read_time': '7 min read',
        'is_published': True,
        'is_featured': False,
        'tags': ['Uzbekistan', 'Student Life', 'Culture'],
        'views': 0
      },
      {
        'title': 'FMGE Preparation Tips for MBBS Abroad Students',
        'slug': 'fmge-preparation-tips',
        'excerpt': 'Essential tips and strategies to prepare for FMGE exam after completing MBBS abroad. Expert advice from successful candidates.',
        'content': '<p>Preparing for the FMGE requires a strategic and disciplined approach...</p>',
        'featured_image': '/images/news/fair.jpg',
        'category': 'Exam Tips',
        'author': 'Dr. Rajesh Verma',
        'read_time': '10 min read',
        'is_published': True,
        'is_featured': False,
        'tags': ['FMGE', 'MCI Screening', 'Exam Tips'],
        'views': 0
      },
      {
        'title': 'Cost Comparison: MBBS in Different Countries',
        'slug': 'mbbs-cost-comparison-countries',
        'excerpt': 'Detailed comparison of MBBS education costs in Russia, Georgia, Kazakhstan, Uzbekistan, and other popular destinations for Indian students.',
        'content': '<p>When planning to study MBBS abroad, understanding the total financial commitment is crucial...</p>',
        'featured_image': '/images/news/fair.jpg',
        'category': 'Finance',
        'author': 'Counseling Team',
        'read_time': '9 min read',
        'is_published': True,
        'is_featured': False,
        'tags': ['Finance', 'Cost', 'Comparison'],
        'views': 0
      },
    ]

    logger.info(f"Adding {len(blogs)} blogs...")
    for blog in blogs:
        # Check if exists
        if not collection.find_one({'slug': blog['slug']}):
            blog['created_at'] = datetime.utcnow()
            blog['updated_at'] = datetime.utcnow()
            blog['published_at'] = datetime.utcnow()
            collection.insert_one(blog)
            logger.info(f"Added blog: {blog['title']}")
        else:
            logger.info(f"Blog {blog['slug']} already exists, skipping")
            
    logger.info("Seeding completed successfully!")

if __name__ == "__main__":
    seed_blogs()
