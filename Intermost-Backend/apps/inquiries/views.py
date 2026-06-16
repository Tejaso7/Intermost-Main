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
import random
import string

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


class InquiryImportView(APIView):
    """Bulk import inquiries/leads."""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        leads = request.data.get('leads', [])
        if not isinstance(leads, list):
            return Response({'error': 'Invalid format: leads must be a list'}, status=status.HTTP_400_BAD_REQUEST)
        
        collection = get_collection('inquiries')
        imported_count = 0
        skipped_count = 0
        
        for lead in leads:
            name = lead.get('name', '').strip()
            email = lead.get('email', '').strip().lower()
            phone = lead.get('phone', '').strip()
            
            # Simple validation
            if not name or not email or not phone:
                skipped_count += 1
                continue
            
            # Check for existing lead by email
            exists = collection.find_one({'email': email})
            if exists:
                skipped_count += 1
                continue
            
            # Create new lead
            inquiry = {
                'name': name,
                'email': email,
                'phone': phone,
                'country_code': lead.get('country_code', '+91').strip(),
                'neet_score': lead.get('neet_score', ''),
                'neet_rank': lead.get('neet_rank', ''),
                'percentage': lead.get('percentage', ''),
                'qualification': lead.get('qualification', '12th'),
                'preferred_country': lead.get('preferred_country', lead.get('interested_country', '')),
                'preferred_intake': lead.get('preferred_intake', ''),
                'budget': lead.get('budget', ''),
                'message': lead.get('message', 'Bulk Imported Lead'),
                'source': lead.get('source', 'bulk_import'),
                'status': 'new',
                'assigned_to': None,
                'notes': [],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'contacted_at': None,
            }
            collection.insert_one(inquiry)
            imported_count += 1
            
        return Response({
            'message': 'Import completed',
            'imported': imported_count,
            'skipped': skipped_count
        }, status=status.HTTP_200_OK)


class EmailCampaignView(APIView):
    """Send bulk email campaigns to selected inquiries."""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        recipient_ids = request.data.get('recipient_ids', [])
        subject = request.data.get('subject', '').strip()
        body = request.data.get('body', '').strip()
        
        if not subject or not body:
            return Response({'error': 'Subject and Body are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        collection = get_collection('inquiries')
        query = {}
        if recipient_ids:
            try:
                object_ids = [ObjectId(rid) for rid in recipient_ids]
                query['_id'] = {'$in': object_ids}
            except InvalidId:
                return Response({'error': 'Invalid recipient ID(s) format'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'recipient_ids list is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        recipients = list(collection.find(query))
        if not recipients:
            return Response({'error': 'No recipients found matching the provided IDs'}, status=status.HTTP_44_NOT_FOUND)
            
        from django.core.mail import EmailMultiAlternatives
        from django.utils.html import strip_tags
        from django.conf import settings
        
        sent_count = 0
        failed_count = 0
        failed_emails = []
        
        for rec in recipients:
            email = rec.get('email', '').strip()
            name = rec.get('name', 'Student').strip()
            if not email:
                continue
                
            rec_subject = subject.replace('{{name}}', name)
            rec_body = body.replace('{{name}}', name)
            text_content = strip_tags(rec_body)
            
            try:
                from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', '')
                msg = EmailMultiAlternatives(
                    subject=rec_subject,
                    body=text_content,
                    from_email=from_email,
                    to=[email]
                )
                msg.attach_alternative(rec_body, "text/html")
                msg.send()
                sent_count += 1
            except Exception as e:
                logger.error(f"Error sending campaign email to {email}: {str(e)}")
                failed_count += 1
                failed_emails.append(email)
                
        return Response({
            'message': 'Campaign delivery finished',
            'sent': sent_count,
            'failed': failed_count,
            'failed_emails': failed_emails
        }, status=status.HTTP_200_OK)


class SendOTPView(APIView):
    """Generate and send an OTP to email for verification."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        phone = request.data.get('phone', '').strip()
        
        if not email or not phone:
            return Response({'error': 'Email and phone are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        otp = ''.join(random.choices(string.digits, k=6))
        
        collection = get_collection('otp_verifications')
        collection.create_index("created_at", expireAfterSeconds=600)
        
        collection.delete_many({'$or': [{'email': email}, {'phone': phone}]})
        
        collection.insert_one({
            'email': email,
            'phone': phone,
            'otp': otp,
            'created_at': datetime.utcnow()
        })
        
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings
        
        subject = "Your OTP for Intermost Subscription"
        html_content = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0d9488; text-align: center;">Intermost Study Abroad</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p>Hello,</p>
            <p>Thank you for your interest in Intermost. To complete your newsletter subscription, please use the following One-Time Password (OTP):</p>
            <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 30px 0; color: #111827;">
                {otp}
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; {datetime.now().year} Intermost Study Abroad. All rights reserved.</p>
        </div>
        """
        
        try:
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', '')
            msg = EmailMultiAlternatives(
                subject=subject,
                body=f"Your OTP code is: {otp}",
                from_email=from_email,
                to=[email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            logger.info(f"OTP email sent to {email}. Phone: {phone}")
        except Exception as e:
            logger.error(f"Failed to send OTP to {email}: {str(e)}")
            return Response({'error': 'Failed to send OTP. Please check your email and try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({
            'message': 'OTP sent successfully to your email.'
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """Verify OTP and register the user as a subscriber/lead."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip().lower()
        phone = request.data.get('phone', '').strip()
        country_code = request.data.get('country_code', '+91').strip()
        otp = request.data.get('otp', '').strip()
        
        if not name or not email or not phone or not otp:
            return Response({'error': 'Name, email, phone, and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        otp_collection = get_collection('otp_verifications')
        
        record = otp_collection.find_one({
            '$or': [{'email': email}, {'phone': phone}],
            'otp': otp
        })
        
        if not record:
            return Response({'error': 'Invalid or expired OTP code'}, status=status.HTTP_400_BAD_REQUEST)
            
        otp_collection.delete_one({'_id': record['_id']})
        
        inq_collection = get_collection('inquiries')
        
        existing = inq_collection.find_one({'email': email})
        if not existing:
            new_lead = {
                'name': name,
                'email': email,
                'phone': phone,
                'country_code': country_code,
                'neet_score': '',
                'neet_rank': '',
                'percentage': '',
                'qualification': '12th',
                'preferred_country': '',
                'preferred_intake': '',
                'budget': '',
                'message': 'Newsletter & Blog Subscriber',
                'source': 'newsletter',
                'status': 'new',
                'assigned_to': None,
                'notes': [],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'contacted_at': None,
            }
            inq_collection.insert_one(new_lead)
            logger.info(f"New subscriber registered: {name} ({email})")
        else:
            inq_collection.update_one(
                {'_id': existing['_id']},
                {'$set': {
                    'name': name,
                    'phone': phone,
                    'country_code': country_code,
                    'source': 'newsletter',
                    'updated_at': datetime.utcnow()
                }}
            )
            logger.info(f"Existing subscriber updated: {name} ({email})")
            
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings
        
        subject = "Subscription Confirmed - Intermost Study Abroad"
        html_content = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0d9488; text-align: center;">Subscription Confirmed!</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p>Dear {name},</p>
            <p>Thank you for subscribing to Intermost Study Abroad news and blogs updates!</p>
            <p>You have successfully verified your contact details. We will keep you updated with the latest MBBS abroad admissions deadlines, university news, and scholarship details.</p>
            <p>If you have any questions or need direct assistance, please feel free to reply to this email or contact our support team at +91 9058501818.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; {datetime.now().year} Intermost Study Abroad. All rights reserved.</p>
        </div>
        """
        
        try:
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', '')
            msg = EmailMultiAlternatives(
                subject=subject,
                body="Thank you for subscribing to Intermost Study Abroad news and blogs updates!",
                from_email=from_email,
                to=[email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            logger.error(f"Failed to send subscription confirmation email to {email}: {str(e)}")
            
        return Response({
            'message': 'Verified and subscribed successfully!'
        }, status=status.HTTP_200_OK)
