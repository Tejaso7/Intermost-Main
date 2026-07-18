import logging
import secrets
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.mongodb import get_collection

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

# Custom Helper to authenticate APK Users
def get_apk_user_from_request(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    
    users_col = get_collection('apk_users')
    user = users_col.find_one({'token': token, 'is_active': True})
    return user

# APK API Views
class APKLoginView(APIView):
    """API for APK users to authenticate and receive a token."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        users_col = get_collection('apk_users')
        user = users_col.find_one({'username': username})
        
        if not user or not check_password(password, user['password']):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        token = secrets.token_hex(24)
        users_col.update_one(
            {'_id': user['_id']},
            {'$set': {
                'token': token,
                'last_login': datetime.utcnow()
            }}
        )
        
        return Response({
            'message': 'Login successful',
            'token': token,
            'user': {
                'username': user['username'],
                'name': user['name']
            }
        }, status=status.HTTP_200_OK)


class APKLeadsView(APIView):
    """API for APK to fetch assigned cold calling leads."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = get_apk_user_from_request(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        leads_col = get_collection('cold_leads')
        leads = list(leads_col.find({
            'assigned_to': user['username'],
            'status': 'pending'
        }))
        
        return Response({
            'leads': [serialize_doc(l) for l in leads]
        }, status=status.HTTP_200_OK)


class APKCallLogView(APIView):
    """API for APK to submit call results and logs."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = get_apk_user_from_request(request)
        if not user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
        lead_id = request.data.get('lead_id')
        call_status = request.data.get('status') # picked, not_picked, busy, failed
        duration = request.data.get('duration', 0) # in seconds
        notes = request.data.get('notes', '').strip()
        
        if not lead_id or not call_status:
            return Response({'error': 'lead_id and status are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            oid = ObjectId(lead_id)
        except InvalidId:
            return Response({'error': 'Invalid lead ID format'}, status=status.HTTP_400_BAD_REQUEST)
            
        leads_col = get_collection('cold_leads')
        lead = leads_col.find_one({'_id': oid})
        
        if not lead:
            return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if lead['assigned_to'] != user['username']:
            return Response({'error': 'Forbidden: Lead is assigned to another user'}, status=status.HTTP_403_FORBIDDEN)
            
        log_entry = {
            'caller': user['username'],
            'status': call_status,
            'duration': int(duration),
            'notes': notes,
            'called_at': datetime.utcnow().isoformat()
        }
        
        leads_col.update_one(
            {'_id': oid},
            {
                '$set': {
                    'status': call_status,
                    'duration': int(duration),
                    'notes': notes,
                    'updated_at': datetime.utcnow()
                },
                '$push': {
                    'call_logs': log_entry
                }
            }
        )
        
        return Response({'message': 'Call log saved successfully'}, status=status.HTTP_200_OK)


# Admin-facing Views
class APKUsersView(APIView):
    """Admin endpoint to manage APK users."""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users_col = get_collection('apk_users')
        users = list(users_col.find({}))
        
        serialized = []
        for u in users:
            doc = serialize_doc(u)
            doc.pop('password', None)
            serialized.append(doc)
            
        return Response(serialized, status=status.HTTP_200_OK)
        
    def post(self, request):
        username = request.data.get('username', '').strip().lower()
        password = request.data.get('password', '')
        name = request.data.get('name', '').strip()
        
        if not username or not password or not name:
            return Response({'error': 'Name, username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        users_col = get_collection('apk_users')
        exists = users_col.find_one({'username': username})
        if exists:
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        new_user = {
            'username': username,
            'password': make_password(password),
            'name': name,
            'is_active': True,
            'token': None,
            'created_at': datetime.utcnow(),
            'last_login': None
        }
        users_col.insert_one(new_user)
        return Response({'message': 'APK user created successfully'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        username = request.query_params.get('username', '')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        users_col = get_collection('apk_users')
        result = users_col.delete_one({'username': username})
        if result.deleted_count == 0:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'message': 'APK user deleted successfully'}, status=status.HTTP_200_OK)


class ColdLeadsView(APIView):
    """Admin endpoint to search/view imported cold calling leads."""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        leads_col = get_collection('cold_leads')
        
        status_filter = request.query_params.get('status', None)
        assigned_to = request.query_params.get('assigned_to', None)
        search = request.query_params.get('search', None)
        city = request.query_params.get('city', None)
        
        query = {}
        if status_filter:
            query['status'] = status_filter
        if assigned_to:
            query['assigned_to'] = assigned_to if assigned_to != 'unassigned' else None
        if city:
            query['city'] = city
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'phone': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
                {'city': {'$regex': search, '$options': 'i'}},
                {'refno': {'$regex': search, '$options': 'i'}},
            ]
            
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        skip = (page - 1) * limit
        
        total = leads_col.count_documents(query)
        leads = list(
            leads_col.find(query)
            .sort('imported_at', -1)
            .skip(skip)
            .limit(limit)
        )
        
        return Response({
            'count': total,
            'page': page,
            'total_pages': (total + limit - 1) // limit,
            'results': [serialize_doc(l) for l in leads]
        }, status=status.HTTP_200_OK)


class ColdLeadsImportView(APIView):
    """Admin endpoint to bulk import cold calling leads."""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        leads = request.data.get('leads', [])
        if not isinstance(leads, list):
            return Response({'error': 'Invalid format: leads must be a list'}, status=status.HTTP_400_BAD_REQUEST)
            
        leads_col = get_collection('cold_leads')
        imported_count = 0
        
        for lead in leads:
            refno = str(lead.get('refno', '')).strip()
            firstname = lead.get('firstname', '').strip()
            lastname = lead.get('lastname', '').strip()
            
            # Combine firstname and lastname for name, fallback to firstname or refno
            name = lead.get('name', '').strip()
            if not name:
                name = f"{firstname} {lastname}".strip()
            if not name:
                name = f"Lead {refno}" if refno else "Unknown Lead"
                
            phone = lead.get('phone', '').strip()
            if not phone:
                phone = lead.get('phonenumber', '').strip()
                
            email = lead.get('email', '').strip().lower() if lead.get('email') else ''
            
            # Additional fields
            alternatephone = lead.get('alternatephone', '').strip()
            parentno = lead.get('parentno', '').strip()
            streetaddress = lead.get('streetaddress', '').strip()
            city = lead.get('city', '').strip()
            # Normalize city to uppercase to avoid casing inconsistencies in search/grouping
            if city:
                city = city.upper()
                
            state = lead.get('state', '').strip()
            postalcode = lead.get('postalcode', '').strip()
            remarks = lead.get('remarks', '').strip()
            
            if not name or not phone:
                continue
                
            cold_lead = {
                'refno': refno,
                'firstname': firstname,
                'lastname': lastname,
                'name': name,
                'phone': phone,
                'email': email,
                'alternatephone': alternatephone,
                'parentno': parentno,
                'streetaddress': streetaddress,
                'city': city,
                'state': state,
                'postalcode': postalcode,
                'remarks': remarks,
                'status': 'pending',
                'assigned_to': None,
                'assigned_at': None,
                'duration': 0,
                'notes': '',
                'call_logs': [],
                'imported_at': datetime.utcnow()
            }
            leads_col.insert_one(cold_lead)
            imported_count += 1
            
        return Response({
            'message': 'Cold calling leads imported',
            'imported': imported_count
        }, status=status.HTTP_200_OK)


class ColdLeadsAssignView(APIView):
    """Admin endpoint to assign cold calling leads to users."""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        lead_ids = request.data.get('lead_ids', [])
        total_count = request.data.get('total_count', 0)
        usernames = request.data.get('usernames', [])
        method = request.data.get('method', 'manual') # manual, random
        city = request.data.get('city', None)
        
        if not usernames:
            return Response({'error': 'At least one username must be provided'}, status=status.HTTP_400_BAD_REQUEST)
            
        leads_col = get_collection('cold_leads')
        
        # Determine which leads to assign
        target_ids = []
        if lead_ids:
            try:
                target_ids = [ObjectId(lid) for lid in lead_ids]
            except InvalidId:
                return Response({'error': 'Invalid lead ID(s) format'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Fetch unassigned pending leads, optionally filtered by city
            assign_query = {'assigned_to': None, 'status': 'pending'}
            if city:
                assign_query['city'] = city.strip().upper()
                
            if total_count > 0:
                unassigned = list(leads_col.find(assign_query).limit(total_count))
            else:
                unassigned = list(leads_col.find(assign_query))
            target_ids = [l['_id'] for l in unassigned]
            
        if not target_ids:
            return Response({'error': 'No pending leads found to assign'}, status=status.HTTP_400_BAD_REQUEST)
            
        assigned_count = 0
        if method == 'manual' or len(usernames) == 1:
            # Assign all selected leads to the first user
            target_user = usernames[0]
            leads_col.update_many(
                {'_id': {'$in': target_ids}},
                {'$set': {
                    'assigned_to': target_user,
                    'assigned_at': datetime.utcnow()
                }}
            )
            assigned_count = len(target_ids)
        else:
            # Distribute target_ids randomly / round-robin among selected usernames
            for idx, lid in enumerate(target_ids):
                user = usernames[idx % len(usernames)]
                leads_col.update_one(
                    {'_id': lid},
                    {'$set': {
                        'assigned_to': user,
                        'assigned_at': datetime.utcnow()
                    }}
                )
                assigned_count += 1
                
        return Response({
            'message': 'Leads assigned successfully',
            'assigned': assigned_count
        }, status=status.HTTP_200_OK)


class ColdLeadsCitiesView(APIView):
    """Admin endpoint to fetch unique cities for cold calling leads."""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        leads_col = get_collection('cold_leads')
        cities = leads_col.distinct('city')
        # Filter out empty or None values
        cities = [c for c in cities if c]
        return Response({'cities': sorted(cities)}, status=status.HTTP_200_OK)


class ColdLeadsClearView(APIView):
    """Admin endpoint to clear all cold calling leads."""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        leads_col = get_collection('cold_leads')
        result = leads_col.delete_many({})
        return Response({
            'message': 'All cold calling leads cleared successfully',
            'deleted_count': result.deleted_count
        }, status=status.HTTP_200_OK)
