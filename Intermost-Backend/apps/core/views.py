"""
Core Views - Authentication, Health Checks, and Site Settings.
"""

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from apps.mongodb import get_db, get_collection
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """API Health Check endpoint."""
    return Response({
        'status': 'healthy',
        'message': 'Intermost API is running',
        'timestamp': datetime.utcnow().isoformat()
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def db_health_check(request):
    """Database Health Check endpoint."""
    try:
        db = get_db()
        # Ping the database
        db.command('ping')
        return Response({
            'status': 'healthy',
            'database': 'MongoDB Atlas Connected',
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return Response({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class RegisterView(APIView):
    """User Registration endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return Response({
                    'error': f'{field} is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        if User.objects.filter(username=data['username']).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            is_staff=data.get('is_staff', False),
        )
        
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    """User Profile endpoint."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined.isoformat(),
        })
    
    def put(self, request):
        user = request.user
        data = request.data
        
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })


class SiteSettingsView(APIView):
    """Site Settings Management."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get site settings."""
        collection = get_collection('site_settings')
        settings = collection.find_one({'_id': 'main'})
        
        if not settings:
            # Return default settings
            settings = self._get_default_settings()
        
        # Convert ObjectId to string
        if '_id' in settings:
            settings['_id'] = str(settings['_id'])
        
        return Response(settings)
    
    def put(self, request):
        """Update site settings."""
        collection = get_collection('site_settings')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        
        collection.update_one(
            {'_id': 'main'},
            {'$set': data},
            upsert=True
        )
        
        return Response({
            'message': 'Settings updated successfully',
            'data': data
        })
    
    def _get_default_settings(self):
        return {
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
                'years_experience': 23,
                'visa_success_rate': 99
            },
            'hero_bg_type': 'image',
            'hero_bg_url': '/images/countries/russia.jpg',
            'about_images': ['/images/about.jpg']
        }


class StatsView(APIView):
    """Statistics endpoint."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get site statistics."""
        try:
            db = get_db()
            
            stats = {
                'countries': db.countries.count_documents({'is_active': True}),
                'colleges': db.colleges.count_documents({'is_active': True}),
                'testimonials': db.testimonials.count_documents({'is_active': True}),
                'blogs': db.blogs.count_documents({'is_published': True}),
                'inquiries': db.inquiries.count_documents({}),
            }
            
            # Get site stats
            site_settings = db.site_settings.find_one({'_id': 'main'})
            if site_settings and 'stats' in site_settings:
                stats.update(site_settings['stats'])
            
            return Response(stats)
        except Exception as e:
            logger.error(f"Error fetching stats: {e}")
            return Response({
                'students_placed': 5500,
                'partner_universities': 35,
                'years_experience': 23,
                'visa_success_rate': 99
            })


class EnvConfigView(APIView):
    """API endpoint to get and update the .env file (Admin only)."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.conf import settings as django_settings
        import os
        env_path = os.path.join(django_settings.BASE_DIR, '.env')
        content = ""
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                return Response({'error': f"Failed to read .env: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': ".env file does not exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'content': content})

    def post(self, request):
        from django.conf import settings as django_settings
        import os
        import signal
        content = request.data.get('content', '')
        env_path = os.path.join(django_settings.BASE_DIR, '.env')
        try:
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Send SIGHUP to Gunicorn to reload configuration
            if hasattr(signal, 'SIGHUP'):
                try:
                    os.kill(1, signal.SIGHUP)
                except Exception:
                    try:
                        os.kill(os.getppid(), signal.SIGHUP)
                    except:
                        pass
                        
            return Response({'message': ".env file updated and server reloaded successfully!"})
        except Exception as e:
            return Response({'error': f"Failed to save .env: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class YouTubeShortListCreateView(APIView):
    """List and create YouTube shorts."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """List active YouTube shorts."""
        collection = get_collection('youtube_shorts')
        # Allow filtering by all or only active shorts
        is_active_param = request.query_params.get('is_active', 'true')
        query = {}
        if is_active_param.lower() != 'all':
            query['is_active'] = is_active_param.lower() == 'true'
            
        shorts = list(collection.find(query).sort('display_order', 1))
        
        serialized_shorts = []
        for s in shorts:
            s['_id'] = str(s['_id'])
            if 'created_at' in s and isinstance(s['created_at'], datetime):
                s['created_at'] = s['created_at'].isoformat()
            if 'updated_at' in s and isinstance(s['updated_at'], datetime):
                s['updated_at'] = s['updated_at'].isoformat()
            serialized_shorts.append(s)
            
        return Response(serialized_shorts)
        
    def post(self, request):
        """Create a new YouTube short (admin only)."""
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('youtube_shorts')
        data = request.data
        
        short = {
            'title': data.get('title', ''),
            'url': data.get('url', ''),
            'is_active': data.get('is_active', True),
            'display_order': data.get('display_order', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(short)
        short['_id'] = str(result.inserted_id)
        
        short['created_at'] = short['created_at'].isoformat()
        short['updated_at'] = short['updated_at'].isoformat()
        
        return Response({
            'message': 'YouTube short created successfully',
            'data': short
        }, status=status.HTTP_201_CREATED)


class YouTubeShortDetailView(APIView):
    """Retrieve, update, delete YouTube shorts."""
    permission_classes = [AllowAny]
    
    def get(self, request, short_id):
        collection = get_collection('youtube_shorts')
        from bson.errors import InvalidId
        try:
            short = collection.find_one({'_id': ObjectId(short_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not short:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        short['_id'] = str(short['_id'])
        if 'created_at' in short and isinstance(short['created_at'], datetime):
            short['created_at'] = short['created_at'].isoformat()
        if 'updated_at' in short and isinstance(short['updated_at'], datetime):
            short['updated_at'] = short['updated_at'].isoformat()
            
        return Response(short)
        
    def put(self, request, short_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('youtube_shorts')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        from bson.errors import InvalidId
        try:
            result = collection.update_one(
                {'_id': ObjectId(short_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        updated = collection.find_one({'_id': ObjectId(short_id)})
        updated['_id'] = str(updated['_id'])
        updated['created_at'] = updated['created_at'].isoformat()
        updated['updated_at'] = updated['updated_at'].isoformat()
        
        return Response({
            'message': 'Updated successfully',
            'data': updated
        })
        
    def delete(self, request, short_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('youtube_shorts')
        from bson.errors import InvalidId
        try:
            result = collection.delete_one({'_id': ObjectId(short_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class BrochureListCreateView(APIView):
    """List and create Brochures/Prospectuses."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """List active brochures."""
        collection = get_collection('brochures')
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        query = {}
        if request.query_params.get('is_active') and request.query_params.get('is_active') != 'all':
            query['is_active'] = is_active
            
        country = request.query_params.get('country')
        if country:
            query['country'] = country

        brochures = list(collection.find(query).sort('created_at', -1))
        
        serialized_brochures = []
        for b in brochures:
            b['_id'] = str(b['_id'])
            if 'created_at' in b and isinstance(b['created_at'], datetime):
                b['created_at'] = b['created_at'].isoformat()
            if 'updated_at' in b and isinstance(b['updated_at'], datetime):
                b['updated_at'] = b['updated_at'].isoformat()
            serialized_brochures.append(b)
            
        return Response(serialized_brochures)
        
    def post(self, request):
        """Create a new brochure (admin only)."""
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('brochures')
        data = request.data
        
        brochure = {
            'title': data.get('title', ''),
            'file_url': data.get('file_url', ''),
            'country': data.get('country', 'General'),
            'type': data.get('type', 'brochure'),
            'is_active': data.get('is_active', True),
            'downloads_count': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(brochure)
        brochure['_id'] = str(result.inserted_id)
        
        brochure['created_at'] = brochure['created_at'].isoformat()
        brochure['updated_at'] = brochure['updated_at'].isoformat()
        
        return Response({
            'message': 'Brochure created successfully',
            'data': brochure
        }, status=status.HTTP_201_CREATED)


class BrochureDetailView(APIView):
    """Retrieve, update, delete brochures."""
    permission_classes = [AllowAny]
    
    def get(self, request, brochure_id):
        collection = get_collection('brochures')
        from bson.errors import InvalidId
        try:
            brochure = collection.find_one({'_id': ObjectId(brochure_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not brochure:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        brochure['_id'] = str(brochure['_id'])
        if 'created_at' in brochure and isinstance(brochure['created_at'], datetime):
            brochure['created_at'] = brochure['created_at'].isoformat()
        if 'updated_at' in brochure and isinstance(brochure['updated_at'], datetime):
            brochure['updated_at'] = brochure['updated_at'].isoformat()
            
        return Response(brochure)
        
    def put(self, request, brochure_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('brochures')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        from bson.errors import InvalidId
        try:
            result = collection.update_one(
                {'_id': ObjectId(brochure_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        updated = collection.find_one({'_id': ObjectId(brochure_id)})
        updated['_id'] = str(updated['_id'])
        updated['created_at'] = updated['created_at'].isoformat()
        updated['updated_at'] = updated['updated_at'].isoformat()
        
        return Response({
            'message': 'Brochure updated successfully',
            'data': updated
        })
        
    def delete(self, request, brochure_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('brochures')
        from bson.errors import InvalidId
        try:
            result = collection.delete_one({'_id': ObjectId(brochure_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class BrochureDownloadIncrementView(APIView):
    """Increment download statistics for a brochure."""
    permission_classes = [AllowAny]
    
    def post(self, request, brochure_id):
        collection = get_collection('brochures')
        from bson.errors import InvalidId
        try:
            result = collection.update_one(
                {'_id': ObjectId(brochure_id)},
                {'$inc': {'downloads_count': 1}}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'message': 'Download count updated'})


class GlimpseListCreateView(APIView):
    """List and create Glimpses (student real journeys)."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        collection = get_collection('glimpses')
        glimpses = list(collection.find({}).sort('display_order', 1))
        
        # If collection is empty, seed default glimpses
        if not glimpses:
            self._seed_default_glimpses(collection)
            glimpses = list(collection.find({}).sort('display_order', 1))
            
        serialized = []
        for g in glimpses:
            g['_id'] = str(g['_id'])
            if 'created_at' in g and isinstance(g['created_at'], datetime):
                g['created_at'] = g['created_at'].isoformat()
            if 'updated_at' in g and isinstance(g['updated_at'], datetime):
                g['updated_at'] = g['updated_at'].isoformat()
            serialized.append(g)
            
        return Response(serialized)
        
    def post(self, request):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('glimpses')
        data = request.data
        
        glimpse = {
            'title': data.get('title', ''),
            'category': data.get('category', 'campus'),
            'categoryLabel': data.get('categoryLabel', 'Campus Life'),
            'image': data.get('image', ''),
            'caption': data.get('caption', ''),
            'country': data.get('country', 'General'),
            'display_order': int(data.get('display_order', 0)),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(glimpse)
        glimpse['_id'] = str(result.inserted_id)
        glimpse['created_at'] = glimpse['created_at'].isoformat()
        glimpse['updated_at'] = glimpse['updated_at'].isoformat()
        
        return Response({
            'message': 'Glimpse created successfully',
            'data': glimpse
        }, status=status.HTTP_201_CREATED)
        
    def _seed_default_glimpses(self, collection):
        default_glimpses = [
            {
                'title': 'Anatomy Lab Practicals',
                'category': 'training',
                'categoryLabel': 'Clinical Training',
                'image': '/images/russia/var.jpg',
                'caption': 'Students practicing real dissection and anatomical analysis under certified foreign professors.',
                'country': 'Russia',
                'display_order': 1,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'Student Orientation Moscow',
                'category': 'arrivals',
                'categoryLabel': 'Arrival Orientations',
                'image': '/images/russia/yaro.jpg',
                'caption': 'Indian students orientation meeting at Yaroslavl State Medical University.',
                'country': 'Russia',
                'display_order': 2,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'Indian Hostel Mess Dining',
                'category': 'hostel',
                'categoryLabel': 'Hostel & Food',
                'image': '/images/boys.jpg',
                'caption': 'A view of the hostel mess dining hall serving fresh, hot Indian lunch menu prepared by Indian chefs.',
                'country': 'Uzbekistan',
                'display_order': 3,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'Clinical Diagnostics Lab',
                'category': 'training',
                'categoryLabel': 'Clinical Training',
                'image': '/images/russia/iva.jpg',
                'caption': 'Hands-on practice with hospital testing equipment at Volgograd Medical Academy diagnostics wing.',
                'country': 'Russia',
                'display_order': 4,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'University Main Campus Walkway',
                'category': 'campus',
                'categoryLabel': 'Campus Life',
                'image': '/images/russia/bashkir.jpg',
                'caption': 'Group of Indian students in front of the main library gate at Bashkir State Medical University.',
                'country': 'Russia',
                'display_order': 5,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'Departure Group Delhi Airport',
                'category': 'arrivals',
                'categoryLabel': 'Arrival Orientations',
                'image': '/images/BT.jpg',
                'caption': 'Orientation departure group flight boarding for Georgia & Russia batches at Delhi IGI Airport terminal.',
                'country': 'Georgia / Russia',
                'display_order': 6,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            },
            {
                'title': 'Pre-Departure Counseling Seminar',
                'category': 'arrivals',
                'categoryLabel': 'Arrival Orientations',
                'image': '/images/BT1.jpg',
                'caption': 'Parents and student counseling batch briefing seminar prior to visa allocations.',
                'country': 'General',
                'display_order': 7,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
        ]
        collection.insert_many(default_glimpses)


class GlimpseDetailView(APIView):
    """Retrieve, update, delete Glimpses."""
    permission_classes = [AllowAny]
    
    def get(self, request, glimpse_id):
        collection = get_collection('glimpses')
        from bson.errors import InvalidId
        try:
            glimpse = collection.find_one({'_id': ObjectId(glimpse_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not glimpse:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        glimpse['_id'] = str(glimpse['_id'])
        if 'created_at' in glimpse and isinstance(glimpse['created_at'], datetime):
            glimpse['created_at'] = glimpse['created_at'].isoformat()
        if 'updated_at' in glimpse and isinstance(glimpse['updated_at'], datetime):
            glimpse['updated_at'] = glimpse['updated_at'].isoformat()
            
        return Response(glimpse)
        
    def put(self, request, glimpse_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('glimpses')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        from bson.errors import InvalidId
        try:
            result = collection.update_one(
                {'_id': ObjectId(glimpse_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        updated = collection.find_one({'_id': ObjectId(glimpse_id)})
        updated['_id'] = str(updated['_id'])
        updated['created_at'] = updated['created_at'].isoformat()
        updated['updated_at'] = updated['updated_at'].isoformat()
        
        return Response({
            'message': 'Glimpse updated successfully',
            'data': updated
        })
        
    def delete(self, request, glimpse_id):
        if not request.user or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        collection = get_collection('glimpses')
        from bson.errors import InvalidId
        try:
            result = collection.delete_one({'_id': ObjectId(glimpse_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
            
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'message': 'Deleted successfully'}, status=status.HTTP_200_OK)

