"""
Inquiries Views - Handle student inquiry/lead submissions.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timedelta
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


class InquiryListCreateView(APIView):
    """List and create inquiries."""
    
    def get_permissions(self):
        """Allow anyone to submit, admins can view all."""
        if self.request.method == 'GET':
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get(self, request):
        """List all inquiries (Admin only)."""
        collection = get_collection('inquiries')
        
        # Filters
        status_filter = request.query_params.get('status', None)
        country = request.query_params.get('country', None)
        date_from = request.query_params.get('from', None)
        date_to = request.query_params.get('to', None)
        
        query = {}
        if status_filter:
            query['status'] = status_filter
        if country:
            query['preferred_country'] = country
        if date_from:
            query['created_at'] = {'$gte': datetime.fromisoformat(date_from)}
        if date_to:
            if 'created_at' in query:
                query['created_at']['$lte'] = datetime.fromisoformat(date_to)
            else:
                query['created_at'] = {'$lte': datetime.fromisoformat(date_to)}
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        skip = (page - 1) * limit
        
        total = collection.count_documents(query)
        inquiries = list(
            collection.find(query)
            .sort('created_at', -1)
            .skip(skip)
            .limit(limit)
        )
        
        return Response({
            'count': total,
            'page': page,
            'total_pages': (total + limit - 1) // limit,
            'results': [serialize_doc(i) for i in inquiries]
        })
    
    def post(self, request):
        """Submit a new inquiry."""
        collection = get_collection('inquiries')
        data = request.data
        
        # Validate required fields
        required = ['name', 'email', 'phone']
        for field in required:
            if not data.get(field):
                return Response({
                    'error': f'{field} is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        inquiry = {
            # Personal Info
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'country_code': data.get('country_code', '+91'),
            
            # Academic Info
            'neet_score': data.get('neet_score', ''),
            'neet_rank': data.get('neet_rank', ''),
            'percentage': data.get('percentage', ''),
            'qualification': data.get('qualification', '12th'),
            
            # Preferences
            'preferred_country': data.get('preferred_country', ''),
            'preferred_intake': data.get('preferred_intake', ''),
            'budget': data.get('budget', ''),
            
            # Additional
            'message': data.get('message', ''),
            'source': data.get('source', 'website'),  # website, popup, whatsapp, etc.
            'utm_source': data.get('utm_source', ''),
            'utm_medium': data.get('utm_medium', ''),
            'utm_campaign': data.get('utm_campaign', ''),
            
            # Status tracking
            'status': 'new',  # new, contacted, qualified, enrolled, rejected
            'assigned_to': None,
            'notes': [],
            
            # Timestamps
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'contacted_at': None,
        }
        
        result = collection.insert_one(inquiry)
        inquiry['_id'] = str(result.inserted_id)
        
        logger.info(f"New inquiry received: {inquiry['name']} ({inquiry['email']})")
        
        return Response({
            'message': 'Inquiry submitted successfully. Our team will contact you soon.',
            'inquiry_id': inquiry['_id']
        }, status=status.HTTP_201_CREATED)


class InquiryDetailView(APIView):
    """Retrieve, update, delete inquiry."""
    permission_classes = [AllowAny]
    
    def get(self, request, inquiry_id):
        collection = get_collection('inquiries')
        
        try:
            inquiry = collection.find_one({'_id': ObjectId(inquiry_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not inquiry:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_doc(inquiry))
    
    def put(self, request, inquiry_id):
        collection = get_collection('inquiries')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        try:
            result = collection.update_one(
                {'_id': ObjectId(inquiry_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': ObjectId(inquiry_id)})
        return Response({'message': 'Updated', 'data': serialize_doc(updated)})
    
    def delete(self, request, inquiry_id):
        collection = get_collection('inquiries')
        
        try:
            result = collection.delete_one({'_id': ObjectId(inquiry_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Deleted'}, status=status.HTTP_204_NO_CONTENT)


class InquiryStatusView(APIView):
    """Update inquiry status and add notes."""
    permission_classes = [AllowAny]
    
    def put(self, request, inquiry_id):
        collection = get_collection('inquiries')
        data = request.data
        
        update_data = {'updated_at': datetime.utcnow()}
        
        if 'status' in data:
            update_data['status'] = data['status']
            if data['status'] == 'contacted':
                update_data['contacted_at'] = datetime.utcnow()
        
        if 'assigned_to' in data:
            update_data['assigned_to'] = data['assigned_to']
        
        try:
            object_id = ObjectId(inquiry_id)
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add note if provided
        if 'note' in data:
            note = {
                'text': data['note'],
                'added_by': str(request.user),
                'added_at': datetime.utcnow().isoformat()
            }
            collection.update_one(
                {'_id': object_id},
                {'$push': {'notes': note}}
            )
        
        result = collection.update_one(
            {'_id': object_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': object_id})
        return Response({'message': 'Status updated', 'data': serialize_doc(updated)})


class InquiryStatsView(APIView):
    """Get inquiry statistics."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        collection = get_collection('inquiries')
        
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=now.weekday())
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        stats = {
            'total': collection.count_documents({}),
            'today': collection.count_documents({'created_at': {'$gte': today_start}}),
            'this_week': collection.count_documents({'created_at': {'$gte': week_start}}),
            'this_month': collection.count_documents({'created_at': {'$gte': month_start}}),
            'by_status': {
                'new': collection.count_documents({'status': 'new'}),
                'contacted': collection.count_documents({'status': 'contacted'}),
                'qualified': collection.count_documents({'status': 'qualified'}),
                'enrolled': collection.count_documents({'status': 'enrolled'}),
                'rejected': collection.count_documents({'status': 'rejected'}),
            },
            'by_country': list(collection.aggregate([
                {'$group': {'_id': '$preferred_country', 'count': {'$sum': 1}}},
                {'$sort': {'count': -1}},
                {'$limit': 10}
            ]))
        }
        
        return Response(stats)
