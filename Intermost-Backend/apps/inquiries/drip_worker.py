"""
Lead Nurturing Drip Worker - Processes automated WhatsApp and Email drip sequences.
"""
import os
import time
import threading
import logging
import re
from datetime import datetime, timedelta
from apps.mongodb import get_collection
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

COUNTRY_PROSPECTUS = {
    'russia': 'https://intermost.in/downloads/prospectus-russia.pdf',
    'georgia': 'https://intermost.in/downloads/prospectus-georgia.pdf',
    'uzbekistan': 'https://intermost.in/downloads/prospectus-uzbekistan.pdf',
    'kazakhstan': 'https://intermost.in/downloads/prospectus-kazakhstan.pdf',
    'nepal': 'https://intermost.in/downloads/prospectus-nepal.pdf',
    'vietnam': 'https://intermost.in/downloads/prospectus-vietnam.pdf',
}

def send_whatsapp(phone, message):
    try:
        from apps.whatsapp.views import send_whatsapp_api_message
        config_col = get_collection('whatsapp_config')
        config = config_col.find_one({'_id': 'global'}) or {'gateway': 'simulation'}
        success, reason = send_whatsapp_api_message(config, phone, message)
        logger.info(f"Drip WhatsApp to {phone}: success={success}, reason={reason}")
        return success
    except Exception as e:
        logger.error(f"Drip WhatsApp error to {phone}: {e}")
        return False

def send_email(email, subject, text_body, html_body):
    try:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', '')
        if not from_email:
            logger.warning("No email sender configuration found in settings.")
            return False
            
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=from_email,
            to=[email]
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send()
        logger.info(f"Drip email to {email}: success")
        return True
    except Exception as e:
        logger.error(f"Drip email error to {email}: {e}")
        return False

def process_drips():
    try:
        drips_col = get_collection('lead_nurture_drips')
        now = datetime.now()
        pending = list(drips_col.find({
            'status': 'active',
            'next_run': {'$lte': now}
        }))
        
        if not pending:
            return
            
        logger.info(f"Processing {len(pending)} pending lead nurturing drips...")
        
        for drip in pending:
            drip_id = drip['_id']
            name = drip.get('name', 'Student')
            phone = drip.get('phone')
            email = drip.get('email')
            country = drip.get('country', 'Russia')
            step = drip.get('current_step', 1)
            
            success_wa = False
            success_email = False
            
            if step == 1:
                # Day 1: Welcoming Greeting
                subject = f"Welcome to Intermost Study Abroad - MBBS in {country}"
                text_body = f"Hello {name},\n\nThank you for choosing Intermost. We have received your inquiry for studying MBBS in {country}. A senior counselor will contact you shortly to guide you step-by-step.\n\nBest Regards,\nIntermost Team"
                html_body = f"""
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <h2 style="color: #3b82f6;">Welcome to Intermost Study Abroad!</h2>
                    <p>Hello <strong>{name}</strong>,</p>
                    <p>Thank you for reaching out to us. We have received your request regarding <strong>MBBS in {country}</strong>.</p>
                    <p>Our senior counselor will get in touch with you shortly on your registered number to explain the eligibility, cost, and university options.</p>
                    <hr style="border: 0; border-top: 1px dashed #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #6b7280;">Intermost Consulting - Agra Office, India</p>
                </div>
                """
                wa_msg = f"Hello {name}! Thank you for choosing Intermost. We have received your request for studying MBBS in {country}. A senior counselor will call you shortly. Let us know if you have any questions!"
                
                success_wa = send_whatsapp(phone, wa_msg) if phone else True
                success_email = send_email(email, subject, text_body, html_body) if email else True
                
                # Advance to step 2 (runs in 24 hours)
                drips_col.update_one({'_id': drip_id}, {
                    '$set': {
                        'current_step': 2,
                        'next_run': datetime.now() + timedelta(days=1),
                        'updated_at': datetime.now()
                    },
                    '$push': {
                        'logs': {
                            'step': 1,
                            'sent_at': datetime.now(),
                            'whatsapp': success_wa,
                            'email': success_email
                        }
                    }
                })
                
            elif step == 2:
                # Day 2: Prospectus link
                slug = country.lower().strip() if country else 'russia'
                prospectus_url = COUNTRY_PROSPECTUS.get(slug, 'https://intermost.in/downloads/prospectus.pdf')
                
                subject = f"Official MBBS Prospectus for {country} - Intermost"
                text_body = f"Hello {name},\n\nHere is the official MBBS Admission Prospectus for {country}: {prospectus_url}\n\nReview the course structure, top colleges, and overall budget details. Let us know if you want selection details.\n\nBest Regards,\nIntermost Team"
                html_body = f"""
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <h2 style="color: #3b82f6;">MBBS Prospectus for {country}</h2>
                    <p>Hello <strong>{name}</strong>,</p>
                    <p>As promised, here is the official prospectus containing details about fees, colleges, living costs, and admission process in {country}:</p>
                    <p style="margin: 24px 0;"><a href="{prospectus_url}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Download Prospectus PDF</a></p>
                    <p>Please review the details and let us know your preferred college choice!</p>
                    <hr style="border: 0; border-top: 1px dashed #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #6b7280;">Intermost Consulting - Agra Office, India</p>
                </div>
                """
                wa_msg = f"Hi {name}! Here is the official MBBS Admission Prospectus for {country} containing details about top colleges, fees, and eligibility: {prospectus_url}"
                
                success_wa = send_whatsapp(phone, wa_msg) if phone else True
                success_email = send_email(email, subject, text_body, html_body) if email else True
                
                # Advance to step 3 (runs in 24 hours)
                drips_col.update_one({'_id': drip_id}, {
                    '$set': {
                        'current_step': 3,
                        'next_run': datetime.now() + timedelta(days=1),
                        'updated_at': datetime.now()
                    },
                    '$push': {
                        'logs': {
                            'step': 2,
                            'sent_at': datetime.now(),
                            'whatsapp': success_wa,
                            'email': success_email
                        }
                    }
                })
                
            elif step == 3:
                # Day 3: Testimonials / Call Booking
                subject = f"See what our placed Alumni Students say! - Intermost"
                text_body = f"Hello {name},\n\nCheck out the experiences of students placed by Intermost in top medical colleges: https://intermost.in/testimonials\n\nContact us on WhatsApp or reply here to book a free personal counselor selection call today!\n\nBest Regards,\nIntermost Team"
                html_body = f"""
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <h2 style="color: #3b82f6;">Hear From Our Successful Alumni!</h2>
                    <p>Hello <strong>{name}</strong>,</p>
                    <p>Over the years, we have guided hundreds of aspiring doctors to top medical universities globally. Here is what they say about their hostels, clinical exposure, and our services:</p>
                    <p style="margin: 24px 0;"><a href="https://intermost.in/testimonials" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Alumni Testimonials</a></p>
                    <p>Are you ready to select your university? Contact us now to initiate your application form!</p>
                    <hr style="border: 0; border-top: 1px dashed #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #6b7280;">Intermost Consulting - Agra Office, India</p>
                </div>
                """
                wa_msg = f"Hello {name}! Over 500+ student doctors have been successfully placed abroad by Intermost. Watch their placement video reviews here: https://intermost.in/testimonials. Reply here to book your counseling session!"
                
                success_wa = send_whatsapp(phone, wa_msg) if phone else True
                success_email = send_email(email, subject, text_body, html_body) if email else True
                
                # Complete the campaign
                drips_col.update_one({'_id': drip_id}, {
                    '$set': {
                        'status': 'completed',
                        'updated_at': datetime.now()
                    },
                    '$push': {
                        'logs': {
                            'step': 3,
                            'sent_at': datetime.now(),
                            'whatsapp': success_wa,
                            'email': success_email
                        }
                    }
                })
                
    except Exception as e:
        logger.error(f"Error processing lead drips: {e}")

def run_drip_worker_loop():
    logger.info("Initializing Lead Nurturing automated drip daemon worker thread...")
    # Prevent duplicate loops during debug reload
    if os.environ.get('RUN_MAIN') == 'true' or not settings.DEBUG:
        while True:
            try:
                config_col = get_collection('site_settings')
                config = config_col.find_one({'_id': 'drip_nurturing_config'}) or {'is_enabled': True}
                
                if config.get('is_enabled', True):
                    process_drips()
            except Exception as e:
                logger.error(f"Drip worker loop error: {e}")
            
            # Poll every 5 minutes (or 60 seconds in debug mode)
            time.sleep(60 if settings.DEBUG else 300)

def start_drip_worker():
    thread = threading.Thread(target=run_drip_worker_loop, daemon=True, name="LeadDripWorker")
    thread.start()
