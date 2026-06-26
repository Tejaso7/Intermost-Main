import logging
import re
from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from apps.mongodb import get_db, get_collection
from bson import ObjectId

logger = logging.getLogger(__name__)

class ImportContactsView(APIView):
    """
    Import contacts from JSON array (parsed Excel)
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        contacts_data = request.data.get('contacts', [])
        
        if not contacts_data or not isinstance(contacts_data, list):
            return Response({'error': 'Invalid data. Expected an array of contacts.'}, status=status.HTTP_400_BAD_REQUEST)
        
        collection = get_collection('contacts')
        imported_count = 0
        
        for contact in contacts_data:
            name = contact.get('name', '').strip()
            phone = str(contact.get('phone', '')).strip()
            
            if not phone:
                continue
                
            # Basic cleanup of phone number (remove spaces, dashes)
            phone = re.sub(r'[\s\-()]+', '', phone)
            
            # Upsert based on phone number
            result = collection.update_one(
                {'phone': phone},
                {
                    '$set': {
                        'name': name,
                        'phone': phone,
                        'updated_at': datetime.utcnow()
                    },
                    '$setOnInsert': {
                        'created_at': datetime.utcnow()
                    }
                },
                upsert=True
            )
            
            if result.upserted_id or result.modified_count > 0:
                imported_count += 1
                
        return Response({
            'message': 'Contacts imported successfully',
            'imported': imported_count
        })


class ContactsListView(APIView):
    """
    List all contacts, with optional search parameter and pagination
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        
        try:
            page = int(request.query_params.get('page', 1))
            if page < 1:
                page = 1
        except ValueError:
            page = 1
            
        try:
            limit = int(request.query_params.get('limit', 50))
            if limit < 1:
                limit = 50
        except ValueError:
            limit = 50
            
        collection = get_collection('contacts')
        skip = (page - 1) * limit
        
        if search_query:
            escaped_search = re.escape(search_query)
            match_query = {
                '$or': [
                    {'name': {'$regex': escaped_search, '$options': 'i'}},
                    {'phone': {'$regex': escaped_search, '$options': 'i'}}
                ]
            }
            total_count = collection.count_documents(match_query)
            
            pipeline = [
                { '$match': match_query },
                {
                    '$addFields': {
                        'starts_with': {
                            '$cond': [
                                {
                                    '$regexMatch': {
                                        'input': { '$ifNull': ['$name', ''] },
                                        'regex': f'^{escaped_search}',
                                        'options': 'i'
                                    }
                                },
                                1, 0
                            ]
                        }
                    }
                },
                { '$sort': {'starts_with': -1, 'name': 1} },
                { '$skip': skip },
                { '$limit': limit }
            ]
            cursor = collection.aggregate(pipeline)
        else:
            total_count = collection.count_documents({})
            cursor = collection.find({}).sort('name', 1).skip(skip).limit(limit)
        
        results = []
        for doc in cursor:
            # Convert ObjectId to string
            doc['_id'] = str(doc['_id'])
            results.append(doc)
            
        return Response({
            'count': total_count,
            'page': page,
            'limit': limit,
            'total_pages': (total_count + limit - 1) // limit,
            'results': results
        })


class SendMessageView(APIView):
    """
    Send a WhatsApp message to specific contacts
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        contact_ids = request.data.get('contact_ids', [])
        message_text = request.data.get('message', '').strip()
        select_all = request.data.get('select_all', False)
        search_query = request.data.get('search', '')
        
        if not message_text:
            return Response({'error': 'message is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        collection = get_collection('contacts')
        
        target_phones = []
        
        if select_all:
            # Send to all matching search
            query = {}
            if search_query:
                query = {
                    '$or': [
                        {'name': {'$regex': search_query, '$options': 'i'}},
                        {'phone': {'$regex': search_query, '$options': 'i'}}
                    ]
                }
            cursor = collection.find(query)
            for doc in cursor:
                target_phones.append(doc.get('phone'))
        else:
            if not contact_ids or not isinstance(contact_ids, list):
                return Response({'error': 'contact_ids array is required when select_all is false'}, status=status.HTTP_400_BAD_REQUEST)
                
            object_ids = []
            for cid in contact_ids:
                try:
                    object_ids.append(ObjectId(cid))
                except Exception:
                    pass
                    
            cursor = collection.find({'_id': {'$in': object_ids}})
            for doc in cursor:
                target_phones.append(doc.get('phone'))
                
        if not target_phones:
            return Response({'error': 'No valid contacts found'}, status=status.HTTP_404_NOT_FOUND)
            
        # TODO: Implement actual WhatsApp API call here (e.g., using requests to Meta Graph API, Twilio, etc.)
        for phone in target_phones:
            logger.info(f"Simulating sending WhatsApp message to {phone}: {message_text}")
            
        return Response({
            'message': f'Message sent successfully to {len(target_phones)} contacts',
            'status': 'sent',
            'sent_count': len(target_phones)
        })
