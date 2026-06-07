"""
Blogs Views - CRUD operations for blog management.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
import re
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


def create_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug


class BlogListCreateView(APIView):
    """List and create blogs."""
    
    def get_permissions(self):
        """Allow read for all, write for admins only."""
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get(self, request):
        collection = get_collection('blogs')
        
        is_published = request.query_params.get('published', 'true').lower() == 'true'
        category = request.query_params.get('category', None)
        
        query = {'is_published': is_published}
        if category:
            query['category'] = category
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        skip = (page - 1) * limit
        
        total = collection.count_documents(query)
        blogs = list(
            collection.find(query)
            .sort('published_at', -1)
            .skip(skip)
            .limit(limit)
        )
        
        return Response({
            'count': total,
            'page': page,
            'results': [serialize_doc(b) for b in blogs]
        })
    
    def post(self, request):
        collection = get_collection('blogs')
        data = request.data
        
        if not data.get('title'):
            return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        blog = {
            'title': data.get('title'),
            'slug': data.get('slug') or create_slug(data['title']),
            'excerpt': data.get('excerpt', ''),
            'content': data.get('content', ''),
            'featured_image': data.get('featured_image', ''),
            'category': data.get('category', 'General'),
            'tags': data.get('tags', []),
            'author': data.get('author', 'Admin'),
            'read_time': data.get('read_time', '5 min'),
            'is_published': data.get('is_published', False),
            'is_featured': data.get('is_featured', False),
            'seo': {
                'title': data.get('seo', {}).get('title', data.get('title')),
                'description': data.get('seo', {}).get('description', data.get('excerpt', '')),
                'keywords': data.get('seo', {}).get('keywords', [])
            },
            'views': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'published_at': datetime.utcnow() if data.get('is_published') else None
        }
        
        result = collection.insert_one(blog)
        blog['_id'] = str(result.inserted_id)
        
        return Response({
            'message': 'Blog created successfully',
            'data': blog
        }, status=status.HTTP_201_CREATED)


class BlogDetailView(APIView):
    """Retrieve, update, delete blog."""
    permission_classes = [AllowAny]
    
    def get(self, request, blog_id):
        collection = get_collection('blogs')
        
        try:
            blog = collection.find_one({'_id': ObjectId(blog_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not blog:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Increment views
        collection.update_one({'_id': ObjectId(blog_id)}, {'$inc': {'views': 1}})
        
        return Response(serialize_doc(blog))
    
    def put(self, request, blog_id):
        collection = get_collection('blogs')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        try:
            result = collection.update_one(
                {'_id': ObjectId(blog_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': ObjectId(blog_id)})
        return Response({'message': 'Updated', 'data': serialize_doc(updated)})
    
    def delete(self, request, blog_id):
        collection = get_collection('blogs')
        
        try:
            result = collection.delete_one({'_id': ObjectId(blog_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Deleted'}, status=status.HTTP_204_NO_CONTENT)


class BlogBySlugView(APIView):
    """Get blog by slug."""
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        collection = get_collection('blogs')
        blog = collection.find_one({'slug': slug.lower()})
        
        if not blog:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        collection.update_one({'slug': slug.lower()}, {'$inc': {'views': 1}})
        return Response(serialize_doc(blog))


class BlogsByCategoryView(APIView):
    """Get blogs by category."""
    permission_classes = [AllowAny]
    
    def get(self, request, category):
        collection = get_collection('blogs')
        
        blogs = list(collection.find({
            'category': category,
            'is_published': True
        }).sort('published_at', -1))
        
        return Response({
            'category': category,
            'count': len(blogs),
            'results': [serialize_doc(b) for b in blogs]
        })
