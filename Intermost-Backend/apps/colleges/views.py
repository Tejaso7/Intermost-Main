"""
Colleges Views - CRUD operations for college/university management.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from .schemas import get_default_college
import logging
import re

logger = logging.getLogger(__name__)


def serialize_college(college):
    """Convert MongoDB document to JSON-serializable format."""
    if college:
        college['_id'] = str(college['_id'])
        if college.get('country_id'):
            college['country_id'] = str(college['country_id'])
        for key, value in college.items():
            if isinstance(value, ObjectId):
                college[key] = str(value)
            elif isinstance(value, datetime):
                college[key] = value.isoformat()
    return college


def create_slug(name):
    """Create URL-friendly slug from name."""
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug


class CollegeListCreateView(APIView):
    """
    GET: List all colleges
    POST: Create a new college (Admin only)
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """List all active colleges."""
        collection = get_collection('colleges')
        
        # Query parameters
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        is_featured = request.query_params.get('is_featured', None)
        country_slug = request.query_params.get('country', None)
        is_nmc_approved = request.query_params.get('nmc_approved', None)
        
        # Build query
        query = {'meta.is_active': is_active}
        
        if is_featured is not None:
            query['meta.is_featured'] = is_featured.lower() == 'true'
        if country_slug:
            query['country_slug'] = country_slug.lower()
        if is_nmc_approved is not None:
            query['meta.is_nmc_approved'] = is_nmc_approved.lower() == 'true'
        
        # Sorting
        sort_by = request.query_params.get('sort', 'meta.display_order')
        sort_order = 1 if request.query_params.get('order', 'asc') == 'asc' else -1
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        skip = (page - 1) * limit
        
        # Get total count
        total = collection.count_documents(query)
        
        # Get colleges
        colleges = list(
            collection.find(query)
            .sort(sort_by, sort_order)
            .skip(skip)
            .limit(limit)
        )
        
        # Serialize
        colleges = [serialize_college(c) for c in colleges]
        
        return Response({
            'count': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit,
            'results': colleges
        })
    
    def post(self, request):
        """Create a new college."""
        collection = get_collection('colleges')
        countries_collection = get_collection('countries')
        data = request.data
        
        # Validate required fields
        if not data.get('name'):
            return Response({
                'error': 'College name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not data.get('country_slug'):
            return Response({
                'error': 'Country slug is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify country exists
        country = countries_collection.find_one({'slug': data['country_slug']})
        if not country:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create slug if not provided
        if not data.get('slug'):
            data['slug'] = create_slug(data['name'])
        
        # Check if slug exists
        if collection.find_one({'slug': data['slug']}):
            return Response({
                'error': 'A college with this slug already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Merge with default template
        college = get_default_college()
        college.update(data)
        
        # Set country reference
        college['country_id'] = country['_id']
        college['country_name'] = country['name']
        
        # Set timestamps
        now = datetime.utcnow()
        college['meta']['created_at'] = now
        college['meta']['updated_at'] = now
        
        # Insert into MongoDB
        result = collection.insert_one(college)
        college['_id'] = str(result.inserted_id)
        college['country_id'] = str(college['country_id'])
        
        logger.info(f"Created college: {college['name']} ({college['_id']})")
        
        return Response({
            'message': 'College created successfully',
            'data': serialize_college(college)
        }, status=status.HTTP_201_CREATED)


class CollegeDetailView(APIView):
    """
    GET: Retrieve a college by ID
    PUT: Update a college (Admin only)
    DELETE: Delete a college (Admin only)
    """
    permission_classes = [AllowAny]
    
    def get(self, request, college_id):
        """Get college by ID or slug."""
        collection = get_collection('colleges')
        
        # Try to find by ObjectId first, then by slug
        try:
            college = collection.find_one({'_id': ObjectId(college_id)})
        except InvalidId:
            college = collection.find_one({'slug': college_id.lower()})
        
        if not college:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_college(college))
    
    def put(self, request, college_id):
        """Update a college."""
        collection = get_collection('colleges')
        data = request.data
        
        try:
            object_id = ObjectId(college_id)
        except InvalidId:
            return Response({
                'error': 'Invalid college ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if college exists
        existing = collection.find_one({'_id': object_id})
        if not existing:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Update timestamp
        if 'meta' not in data:
            data['meta'] = existing.get('meta', {})
        data['meta']['updated_at'] = datetime.utcnow()
        
        # Remove _id from data if present
        data.pop('_id', None)
        
        # Update in MongoDB
        collection.update_one(
            {'_id': object_id},
            {'$set': data}
        )
        
        # Get updated document
        updated = collection.find_one({'_id': object_id})
        
        logger.info(f"Updated college: {college_id}")
        
        return Response({
            'message': 'College updated successfully',
            'data': serialize_college(updated)
        })
    
    def delete(self, request, college_id):
        """Delete a college."""
        collection = get_collection('colleges')
        
        try:
            object_id = ObjectId(college_id)
        except InvalidId:
            return Response({
                'error': 'Invalid college ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.delete_one({'_id': object_id})
        
        if result.deleted_count == 0:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Deleted college: {college_id}")
        
        return Response({
            'message': 'College deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class CollegesByCountryView(APIView):
    """Get all colleges for a specific country."""
    permission_classes = [AllowAny]
    
    def get(self, request, country_slug):
        """Get colleges by country slug."""
        collection = get_collection('colleges')
        
        query = {
            'country_slug': country_slug.lower(),
            'meta.is_active': True
        }
        
        # Sorting
        sort_by = request.query_params.get('sort', 'meta.display_order')
        sort_order = 1 if request.query_params.get('order', 'asc') == 'asc' else -1
        
        colleges = list(collection.find(query).sort(sort_by, sort_order))
        colleges = [serialize_college(c) for c in colleges]
        
        return Response({
            'country': country_slug,
            'count': len(colleges),
            'results': colleges
        })


class CollegeGalleryView(APIView):
    """Manage college gallery."""
    permission_classes = [AllowAny]
    
    def get(self, request, college_id):
        """Get gallery for a college."""
        collection = get_collection('colleges')
        
        try:
            college = collection.find_one(
                {'_id': ObjectId(college_id)},
                {'gallery': 1, 'name': 1}
            )
        except InvalidId:
            return Response({
                'error': 'Invalid college ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not college:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'college_name': college.get('name', ''),
            'gallery': college.get('gallery', [])
        })
    
    def put(self, request, college_id):
        """Update gallery for a college."""
        collection = get_collection('colleges')
        gallery = request.data.get('gallery', [])
        
        try:
            object_id = ObjectId(college_id)
        except InvalidId:
            return Response({
                'error': 'Invalid college ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.update_one(
            {'_id': object_id},
            {
                '$set': {
                    'gallery': gallery,
                    'meta.updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': 'Gallery updated successfully',
            'gallery': gallery
        })
    
    def post(self, request, college_id):
        """Add item to gallery."""
        collection = get_collection('colleges')
        item = request.data
        
        if not item.get('url'):
            return Response({
                'error': 'URL is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            object_id = ObjectId(college_id)
        except InvalidId:
            return Response({
                'error': 'Invalid college ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.update_one(
            {'_id': object_id},
            {
                '$push': {'gallery': item},
                '$set': {'meta.updated_at': datetime.utcnow()}
            }
        )
        
        if result.matched_count == 0:
            return Response({
                'error': 'College not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': 'Gallery item added successfully',
            'item': item
        }, status=status.HTTP_201_CREATED)
