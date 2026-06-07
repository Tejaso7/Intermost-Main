"""
Testimonials Views - CRUD operations for testimonial management.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format."""
    if doc:
        doc['_id'] = str(doc['_id'])
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, datetime):
                doc[key] = value.isoformat()
    return doc


class TestimonialListCreateView(APIView):
    """List and create testimonials."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """List all active testimonials."""
        collection = get_collection('testimonials')
        
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        query = {'is_active': is_active}
        
        testimonials = list(collection.find(query).sort('display_order', 1))
        testimonials = [serialize_doc(t) for t in testimonials]
        
        return Response({
            'count': len(testimonials),
            'results': testimonials
        })
    
    def post(self, request):
        """Create a new testimonial."""
        collection = get_collection('testimonials')
        data = request.data
        
        testimonial = {
            'name': data.get('name', ''),
            'title': data.get('title', ''),           # e.g., "Dr."
            'designation': data.get('designation', ''),  # e.g., "MBBS in Ukraine, Batch 2024"
            'university': data.get('university', ''),
            'country': data.get('country', ''),
            'photo': data.get('photo', ''),
            'quote': data.get('quote', ''),
            'rating': data.get('rating', 5),
            'additional_info': data.get('additional_info', ''),
            'batch_year': data.get('batch_year', ''),
            'is_active': data.get('is_active', True),
            'display_order': data.get('display_order', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(testimonial)
        testimonial['_id'] = str(result.inserted_id)
        
        return Response({
            'message': 'Testimonial created successfully',
            'data': testimonial
        }, status=status.HTTP_201_CREATED)


class TestimonialDetailView(APIView):
    """Retrieve, update, delete testimonial."""
    permission_classes = [AllowAny]
    
    def get(self, request, testimonial_id):
        collection = get_collection('testimonials')
        
        try:
            testimonial = collection.find_one({'_id': ObjectId(testimonial_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not testimonial:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_doc(testimonial))
    
    def put(self, request, testimonial_id):
        collection = get_collection('testimonials')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        try:
            result = collection.update_one(
                {'_id': ObjectId(testimonial_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': ObjectId(testimonial_id)})
        return Response({
            'message': 'Updated successfully',
            'data': serialize_doc(updated)
        })
    
    def delete(self, request, testimonial_id):
        collection = get_collection('testimonials')
        
        try:
            result = collection.delete_one({'_id': ObjectId(testimonial_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
