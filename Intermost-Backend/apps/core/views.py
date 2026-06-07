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
                'years_experience': 21,
                'visa_success_rate': 99
            }
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
                'years_experience': 21,
                'visa_success_rate': 99
            })
