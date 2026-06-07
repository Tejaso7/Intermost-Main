"""
Team Views - CRUD operations for team members and offices.
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


class TeamListCreateView(APIView):
    """List and create team members."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        collection = get_collection('team_members')
        
        is_active = request.query_params.get('is_active', 'true').lower() == 'true'
        region = request.query_params.get('region', None)
        
        query = {'is_active': is_active}
        if region:
            query['region'] = region
        
        members = list(collection.find(query).sort('display_order', 1))
        
        return Response({
            'count': len(members),
            'results': [serialize_doc(m) for m in members]
        })
    
    def post(self, request):
        collection = get_collection('team_members')
        data = request.data
        
        member = {
            'name': data.get('name', ''),
            'title': data.get('title', ''),  # e.g., "Dr.", "Mr."
            'designation': data.get('designation', ''),  # e.g., "President of Intermost India"
            'region': data.get('region', ''),  # e.g., "Uttar Pradesh"
            'photo': data.get('photo', ''),
            'phone': data.get('phone', ''),
            'email': data.get('email', ''),
            'bio': data.get('bio', ''),
            'specialization': data.get('specialization', ''),
            'social': {
                'linkedin': data.get('social', {}).get('linkedin', ''),
                'twitter': data.get('social', {}).get('twitter', ''),
            },
            'is_active': data.get('is_active', True),
            'display_order': data.get('display_order', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(member)
        member['_id'] = str(result.inserted_id)
        
        return Response({
            'message': 'Team member added successfully',
            'data': member
        }, status=status.HTTP_201_CREATED)


class TeamDetailView(APIView):
    """Retrieve, update, delete team member."""
    permission_classes = [AllowAny]
    
    def get(self, request, member_id):
        collection = get_collection('team_members')
        
        try:
            member = collection.find_one({'_id': ObjectId(member_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not member:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serialize_doc(member))
    
    def put(self, request, member_id):
        collection = get_collection('team_members')
        data = request.data
        data['updated_at'] = datetime.utcnow()
        data.pop('_id', None)
        
        try:
            result = collection.update_one(
                {'_id': ObjectId(member_id)},
                {'$set': data}
            )
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.matched_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated = collection.find_one({'_id': ObjectId(member_id)})
        return Response({'message': 'Updated', 'data': serialize_doc(updated)})
    
    def delete(self, request, member_id):
        collection = get_collection('team_members')
        
        try:
            result = collection.delete_one({'_id': ObjectId(member_id)})
        except InvalidId:
            return Response({'error': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        if result.deleted_count == 0:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Deleted'}, status=status.HTTP_204_NO_CONTENT)


class OfficeListView(APIView):
    """List offices."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        collection = get_collection('offices')
        
        offices = list(collection.find({'is_active': True}).sort('display_order', 1))
        
        return Response({
            'count': len(offices),
            'results': [serialize_doc(o) for o in offices]
        })
    
    def post(self, request):
        collection = get_collection('offices')
        data = request.data
        
        office = {
            'name': data.get('name', ''),  # e.g., "India Head Office"
            'company_name': data.get('company_name', 'INTERMOST VENTURES LLP'),
            'address': data.get('address', ''),
            'city': data.get('city', ''),
            'state': data.get('state', ''),
            'country': data.get('country', 'India'),
            'pincode': data.get('pincode', ''),
            'phone': data.get('phone', ''),
            'email': data.get('email', 'admissionintermost@gmail.com'),
            'map_url': data.get('map_url', ''),
            'is_active': data.get('is_active', True),
            'is_head_office': data.get('is_head_office', False),
            'display_order': data.get('display_order', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(office)
        office['_id'] = str(result.inserted_id)
        
        return Response({
            'message': 'Office added successfully',
            'data': office
        }, status=status.HTTP_201_CREATED)
