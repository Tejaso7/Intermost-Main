"""
Countries Views - CRUD operations for country management.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from .schemas import get_default_country
import logging
import re

logger = logging.getLogger(__name__)


def serialize_country(country):
    """Convert MongoDB document to JSON-serializable format."""
    if country:
        country['_id'] = str(country['_id'])
        # Handle nested ObjectIds if any
        for key, value in country.items():
            if isinstance(value, ObjectId):
                country[key] = str(value)
            elif isinstance(value, datetime):
                country[key] = value.isoformat()
    return country


def create_slug(name):
    """Create URL-friendly slug from name."""
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug


class CountryListCreateView(APIView):
    """
    GET: List all countries
    POST: Create a new country (Admin only)
    """
    
    def get_permissions(self):
        """Set permissions based on request method."""
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get(self, request):
        """List all active countries."""
        collection = get_collection('countries')
        
        # Query parameters
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        is_featured = request.query_params.get('is_featured', None)
        
        # Build query
        query = {'meta.is_active': is_active}
        if is_featured is not None:
            query['meta.is_featured'] = is_featured.lower() == 'true'
        
        # Sorting
        sort_by = request.query_params.get('sort', 'meta.display_order')
        sort_order = 1 if request.query_params.get('order', 'asc') == 'asc' else -1
        
        countries = list(collection.find(query).sort(sort_by, sort_order))
        
        # Serialize
        countries = [serialize_country(c) for c in countries]
        
        return Response({
            'count': len(countries),
            'results': countries
        })
    
    def post(self, request):
        """Create a new country."""
        collection = get_collection('countries')
        data = request.data
        
        # Validate required fields
        if not data.get('name'):
            return Response({
                'error': 'Country name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create slug if not provided
        if not data.get('slug'):
            data['slug'] = create_slug(data['name'])
        
        # Check if slug exists
        if collection.find_one({'slug': data['slug']}):
            return Response({
                'error': 'A country with this slug already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Merge with default template
        country = get_default_country()
        country.update(data)
        
        # Set timestamps
        now = datetime.utcnow()
        country['meta']['created_at'] = now
        country['meta']['updated_at'] = now
        
        # Insert into MongoDB
        result = collection.insert_one(country)
        country['_id'] = str(result.inserted_id)
        
        logger.info(f"Created country: {country['name']} ({country['_id']})")
        
        return Response({
            'message': 'Country created successfully',
            'data': serialize_country(country)
        }, status=status.HTTP_201_CREATED)


class CountryDetailView(APIView):
    """
    GET: Retrieve a country by ID
    PUT: Update a country (Admin only)
    DELETE: Delete a country (Admin only)
    """
    permission_classes = [AllowAny]  # Allow all for development
    
    def get(self, request, country_id):
        """Get country by ID."""
        collection = get_collection('countries')
        
        try:
            country = collection.find_one({'_id': ObjectId(country_id)})
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not country:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_country(country))
    
    def put(self, request, country_id):
        """Update a country."""
        collection = get_collection('countries')
        data = request.data
        
        try:
            object_id = ObjectId(country_id)
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if country exists
        existing = collection.find_one({'_id': object_id})
        if not existing:
            return Response({
                'error': 'Country not found'
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
        
        logger.info(f"Updated country: {country_id}")
        
        return Response({
            'message': 'Country updated successfully',
            'data': serialize_country(updated)
        })
    
    def delete(self, request, country_id):
        """Delete a country."""
        collection = get_collection('countries')
        
        try:
            object_id = ObjectId(country_id)
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.delete_one({'_id': object_id})
        
        if result.deleted_count == 0:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Deleted country: {country_id}")
        
        return Response({
            'message': 'Country deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class CountryBySlugView(APIView):
    """Get country by slug (URL-friendly identifier)."""
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Get country by slug."""
        collection = get_collection('countries')
        country = collection.find_one({'slug': slug.lower()})
        
        if not country:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_country(country))


class CountryFeaturesView(APIView):
    """Manage country features."""
    permission_classes = [AllowAny]  # Allow all for development
    
    def get(self, request, country_id):
        """Get features for a country."""
        collection = get_collection('countries')
        
        try:
            country = collection.find_one(
                {'_id': ObjectId(country_id)},
                {'features': 1}
            )
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not country:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'features': country.get('features', [])
        })
    
    def put(self, request, country_id):
        """Update features for a country."""
        collection = get_collection('countries')
        features = request.data.get('features', [])
        
        try:
            object_id = ObjectId(country_id)
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.update_one(
            {'_id': object_id},
            {
                '$set': {
                    'features': features,
                    'meta.updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': 'Features updated successfully',
            'features': features
        })


class CountryFAQsView(APIView):
    """Manage country FAQs."""
    permission_classes = [AllowAny]  # Allow all for development
    
    def get(self, request, country_id):
        """Get FAQs for a country."""
        collection = get_collection('countries')
        
        try:
            country = collection.find_one(
                {'_id': ObjectId(country_id)},
                {'faqs': 1}
            )
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not country:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'faqs': country.get('faqs', [])
        })
    
    def put(self, request, country_id):
        """Update FAQs for a country."""
        collection = get_collection('countries')
        faqs = request.data.get('faqs', [])
        
        try:
            object_id = ObjectId(country_id)
        except InvalidId:
            return Response({
                'error': 'Invalid country ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = collection.update_one(
            {'_id': object_id},
            {
                '$set': {
                    'faqs': faqs,
                    'meta.updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            return Response({
                'error': 'Country not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'message': 'FAQs updated successfully',
            'faqs': faqs
        })
