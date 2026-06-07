"""
News Views - CRUD operations for news/updates management.
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
    if doc:
        doc['_id'] = str(doc['_id'])
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, datetime):
                doc[key] = value.isoformat()
    return doc


class NewsListCreateView(APIView):
    """List and create news items."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        collection = get_collection('news')
        
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        limit = int(request.query_params.get('limit', 10))
        
        news_items = list(
            collection.find({'is_active': is_active})
            .sort('date', -1)
            .limit(limit)
        )
        
        return Response({
            'count': len(news_items),
            'results': [serialize_doc(n) for n in news_items]
        })
    
    def post(self, request):
        collection = get_collection('news')
        data = request.data
        
        news = {
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'media_type': data.get('media_type', 'image'),  # image, video, marquee
            'media_url': data.get('media_url', ''),
            'media_urls': data.get('media_urls', []),  # For marquee/multiple images
            'location': data.get('location', ''),
            'date': data.get('date', datetime.utcnow().strftime('%Y-%m-%d')),
            'badge_text': data.get('badge_text', ''),  # e.g., "📍 Agra, India"
            'badge_color': data.get('badge_color', 'blue'),
            'link': data.get('link', ''),
            'is_active': data.get('is_active', True),
            'is_featured': data.get('is_featured', False),
            'display_order': data.get('display_order', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(news)
        news['_id'] = str(result.inserted_id)
        
        return Response({
            'message': 'News created successfully',
            'data': news
        }, status=status.HTTP_201_CREATED)


class NewsDetailView(APIView):
    """Retrieve, update, delete news."""
    permission_classes = [AllowAny]
    
    def get(self, request, news_id):
        collection = get_collection('news')
        
        try:
            news = collection.find_one({'_id': ObjectId(news_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not news:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_doc(news))
    
    def put(self, request, news_id):
        collection = get_collection('news')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        try:
            result = collection.update_one(
                {'_id': ObjectId(news_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': ObjectId(news_id)})
        return Response({'message': 'Updated', 'data': serialize_doc(updated)})
    
    def delete(self, request, news_id):
        collection = get_collection('news')
        
        try:
            result = collection.delete_one({'_id': ObjectId(news_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Deleted'}, status=status.HTTP_204_NO_CONTENT)
