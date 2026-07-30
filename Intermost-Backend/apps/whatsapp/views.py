import logging
import re
import requests
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


def send_whatsapp_api_message(config, phone, message_text):
    gateway = config.get('gateway', 'simulation')
    if gateway == 'simulation':
        logger.info(f"Simulating sending WhatsApp message to {phone}: {message_text}")
        return True, "Simulation"
        
    clean_phone = re.sub(r'\D', '', phone)
    
    if gateway == 'meta':
        phone_id = config.get('meta_phone_number_id')
        token = config.get('meta_access_token')
        if not phone_id or not token:
            return False, "Meta config missing"
        url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "text",
            "text": {
                "preview_url": False,
                "body": message_text
            }
        }
        try:
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            if res.status_code in [200, 201]:
                return True, "Meta sent"
            else:
                logger.error(f"Meta WhatsApp API error: {res.text}")
                return False, f"Meta API error: {res.status_code}"
        except Exception as e:
            logger.error(f"Meta request exception: {str(e)}")
            return False, str(e)
            
    elif gateway == 'twilio':
        sid = config.get('twilio_account_sid')
        token = config.get('twilio_auth_token')
        sender = config.get('twilio_sender_phone', '')
        if not sid or not token or not sender:
            return False, "Twilio config missing"
        url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
        auth = (sid, token)
        twilio_phone = phone if phone.startswith('+') else f"+{clean_phone}"
        if sender.startswith('+'):
            twilio_sender = sender
        else:
            clean_sender = re.sub(r'\D', '', sender)
            twilio_sender = f"+{clean_sender}"
        data = {
            "From": f"whatsapp:{twilio_sender}",
            "To": f"whatsapp:{twilio_phone}",
            "Body": message_text
        }
        try:
            res = requests.post(url, data=data, auth=auth, timeout=10)
            if res.status_code in [200, 201]:
                return True, "Twilio sent"
            else:
                logger.error(f"Twilio WhatsApp error: {res.text}")
                return False, f"Twilio API error: {res.status_code}"
        except Exception as e:
            logger.error(f"Twilio request exception: {str(e)}")
            return False, str(e)

    elif gateway == 'custom':
        custom_url = config.get('custom_endpoint', '').strip()
        custom_token = config.get('custom_token', '').strip()
        if not custom_url:
            return False, "Custom endpoint missing"
        
        headers = {
            "Content-Type": "application/json"
        }
        if custom_token:
            headers["Authorization"] = f"Bearer {custom_token}"
            
        clean_phone = re.sub(r'\D', '', phone)
        payload = {
            "to": clean_phone,
            "message": message_text
        }
        try:
            res = requests.post(custom_url, json=payload, headers=headers, timeout=10)
            if res.status_code in [200, 201, 202, 204]:
                return True, "Custom sent"
            else:
                logger.error(f"Custom WhatsApp API error: {res.text}")
                return False, f"Custom API error: {res.status_code}"
        except Exception as e:
            logger.error(f"Custom request exception: {str(e)}")
            return False, str(e)
            
    return False, "Unknown gateway"


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
            
        # Load WhatsApp Config
        config_col = get_collection('whatsapp_config')
        config = config_col.find_one({'_id': 'global'}) or {'gateway': 'simulation'}
        
        success_count = 0
        failed_count = 0
        errors = []
        
        for phone in target_phones:
            success, reason = send_whatsapp_api_message(config, phone, message_text)
            if success:
                success_count += 1
            else:
                failed_count += 1
                errors.append(f"{phone}: {reason}")
                
        return Response({
            'message': f'WhatsApp dispatch complete. Sent: {success_count}, Failed: {failed_count}',
            'status': 'complete',
            'sent_count': success_count,
            'failed_count': failed_count,
            'errors': errors
        })


class WhatsAppConfigView(APIView):
    """
    GET and POST API config for WhatsApp.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        config_col = get_collection('whatsapp_config')
        config = config_col.find_one({'_id': 'global'}) or {}
        if config:
            config.pop('_id', None)
        return Response(config)

    def post(self, request):
        config_col = get_collection('whatsapp_config')
        config_data = request.data
        
        # Save config
        config_col.update_one(
            {'_id': 'global'},
            {'$set': {
                'gateway': config_data.get('gateway', 'simulation'),
                'meta_phone_number_id': config_data.get('meta_phone_number_id', '').strip(),
                'meta_access_token': config_data.get('meta_access_token', '').strip(),
                'twilio_account_sid': config_data.get('twilio_account_sid', '').strip(),
                'twilio_auth_token': config_data.get('twilio_auth_token', '').strip(),
                'twilio_sender_phone': config_data.get('twilio_sender_phone', '').strip(),
                'custom_endpoint': config_data.get('custom_endpoint', '').strip(),
                'custom_token': config_data.get('custom_token', '').strip(),
                'updated_at': datetime.utcnow()
            }},
            upsert=True
        )
        return Response({'message': 'WhatsApp configuration updated successfully'})


class WhatsAppCampaignView(APIView):
    """
    Send WhatsApp campaign to leads in the inquiries collection.
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        inquiry_ids = request.data.get('inquiry_ids', [])
        message_text = request.data.get('message', '').strip()
        select_all = request.data.get('select_all', False)
        
        if not message_text:
            return Response({'error': 'message content is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        inquiries_col = get_collection('inquiries')
        target_leads = []
        
        if select_all:
            cursor = inquiries_col.find({})
            for doc in cursor:
                target_leads.append(doc)
        else:
            if not inquiry_ids or not isinstance(inquiry_ids, list):
                return Response({'error': 'inquiry_ids list is required when select_all is false'}, status=status.HTTP_400_BAD_REQUEST)
                
            object_ids = []
            for iid in inquiry_ids:
                try:
                    object_ids.append(ObjectId(iid))
                except Exception:
                    pass
                    
            cursor = inquiries_col.find({'_id': {'$in': object_ids}})
            for doc in cursor:
                target_leads.append(doc)
                
        if not target_leads:
            return Response({'error': 'No valid leads found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Load WhatsApp Config
        config_col = get_collection('whatsapp_config')
        config = config_col.find_one({'_id': 'global'}) or {'gateway': 'simulation'}
        
        success_count = 0
        failed_count = 0
        errors = []
        
        for lead in target_leads:
            phone = lead.get('phone', '')
            cc = lead.get('country_code', '')
            if not phone:
                failed_count += 1
                errors.append(f"Lead {lead.get('name', 'Unknown')}: missing phone number")
                continue
                
            full_phone = phone
            if cc and not phone.startswith('+') and not phone.startswith(cc.replace('+', '')):
                full_phone = f"{cc}{phone}"
                
            personal_msg = message_text.replace('{{name}}', lead.get('name', 'Student'))
            
            success, reason = send_whatsapp_api_message(config, full_phone, personal_msg)
            if success:
                success_count += 1
            else:
                failed_count += 1
                errors.append(f"{lead.get('name')}: {reason}")
                
        return Response({
            'message': f'WhatsApp campaign completed. Sent: {success_count}, Failed: {failed_count}',
            'status': 'complete',
            'sent_count': success_count,
            'failed_count': failed_count,
            'errors': errors
        })


class WhatsAppGroupLinksView(APIView):
    """
    Get and Save State/City WhatsApp Group Links
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        collection = get_collection('whatsapp_group_links')
        doc = collection.find_one({'_id': 'global_links'})
        default_links = {
            'Maharashtra': 'https://chat.whatsapp.com/MAHARASHTRA_MBBS_2026',
            'Karnataka': 'https://chat.whatsapp.com/KARNATAKA_MBBS_2026',
            'Uttar Pradesh': 'https://chat.whatsapp.com/UP_MBBS_2026',
            'Tamil Nadu': 'https://chat.whatsapp.com/TAMILNADU_MBBS_2026',
            'West Bengal': 'https://chat.whatsapp.com/WESTBENGAL_MBBS_2026',
            'Rajasthan': 'https://chat.whatsapp.com/RAJASTHAN_MBBS_2026',
            'General': 'https://chat.whatsapp.com/INDIA_MBBS_2026'
        }
        links = doc.get('links', default_links) if doc else default_links
        return Response(links)

    def post(self, request):
        links = request.data.get('links', {})
        if not isinstance(links, dict):
            return Response({'error': 'Expected links dictionary'}, status=status.HTTP_400_BAD_REQUEST)
            
        collection = get_collection('whatsapp_group_links')
        collection.update_one(
            {'_id': 'global_links'},
            {'$set': {'links': links, 'updated_at': datetime.utcnow()}},
            upsert=True
        )
        return Response({'message': 'State & City group links updated successfully', 'links': links})

