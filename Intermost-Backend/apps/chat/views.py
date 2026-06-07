"""
Chat Views - AI-powered chatbot using Google Gemini.
Separate bots for admin (insights) and students (lead capture).
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.mongodb import get_collection
from bson import ObjectId
from datetime import datetime
import uuid
import json
import logging
import os
from django.conf import settings as django_settings

# Google Gemini SDK (new)
from google import genai

logger = logging.getLogger(__name__)

# Initialize Gemini
GEMINI_API_KEY = getattr(django_settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')

# Create client
client = genai.Client(api_key=GEMINI_API_KEY)

# Use available model
CHAT_MODEL = "gemini-2.0-flash"


def generate_response(prompt: str) -> str:
    """Generate response using Gemini."""
    response = client.models.generate_content(
        model=CHAT_MODEL,
        contents=prompt
    )
    return response.text


def serialize_doc(doc):
    """Serialize MongoDB document for JSON response."""
    if doc:
        doc['_id'] = str(doc['_id'])
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, datetime):
                doc[key] = value.isoformat()
    return doc


def get_database_context():
    """Get current database statistics for admin context."""
    try:
        countries = get_collection('countries')
        colleges = get_collection('colleges')
        inquiries = get_collection('inquiries')
        testimonials = get_collection('testimonials')
        blogs = get_collection('blogs')
        news = get_collection('news')
        team = get_collection('team')
        
        # Get counts
        country_count = countries.count_documents({})
        college_count = colleges.count_documents({})
        inquiry_count = inquiries.count_documents({})
        testimonial_count = testimonials.count_documents({})
        blog_count = blogs.count_documents({})
        news_count = news.count_documents({})
        team_count = team.count_documents({})
        
        # Get recent inquiries
        recent_inquiries = list(inquiries.find().sort('created_at', -1).limit(5))
        recent_inquiries = [serialize_doc(i) for i in recent_inquiries]
        
        # Get inquiry stats by status
        pending_inquiries = inquiries.count_documents({'status': 'pending'})
        contacted_inquiries = inquiries.count_documents({'status': 'contacted'})
        converted_inquiries = inquiries.count_documents({'status': 'converted'})
        
        # Get countries list
        country_names = [c['name'] for c in countries.find({}, {'name': 1})]
        
        # Get college stats per country
        college_stats = {}
        for country in countries.find({}, {'name': 1, 'slug': 1}):
            count = colleges.count_documents({'country_slug': country.get('slug', '')})
            college_stats[country['name']] = count
        
        return {
            'summary': {
                'total_countries': country_count,
                'total_colleges': college_count,
                'total_inquiries': inquiry_count,
                'total_testimonials': testimonial_count,
                'total_blogs': blog_count,
                'total_news': news_count,
                'total_team_members': team_count,
            },
            'inquiry_stats': {
                'pending': pending_inquiries,
                'contacted': contacted_inquiries,
                'converted': converted_inquiries,
            },
            'countries': country_names,
            'colleges_per_country': college_stats,
            'recent_inquiries': recent_inquiries,
        }
    except Exception as e:
        logger.error(f"Error getting database context: {e}")
        return {}


def get_student_context():
    """Get context for student chatbot about countries and colleges."""
    try:
        countries = get_collection('countries')
        colleges = get_collection('colleges')
        
        # Get all countries with key info
        country_list = list(countries.find({}, {
            'name': 1, 'slug': 1, 'tagline': 1, 'description': 1,
            'highlights': 1, 'why_study': 1, 'fees_range': 1
        }))
        
        # Get colleges grouped by country
        college_info = {}
        for country in country_list:
            slug = country.get('slug', '')
            country_colleges = list(colleges.find(
                {'country_slug': slug},
                {'name': 1, 'location': 1, 'recognition': 1, 'courses': 1, 'fees': 1}
            ))
            college_info[country['name']] = [
                {
                    'name': c.get('name', ''),
                    'location': c.get('location', ''),
                    'recognition': c.get('recognition', []),
                    'courses': c.get('courses', [])[:5],  # Limit courses
                    'fees': c.get('fees', {})
                }
                for c in country_colleges
            ]
        
        return {
            'countries': [serialize_doc(c) for c in country_list],
            'colleges_by_country': college_info,
            'services': [
                'MBBS Abroad Admissions',
                'Engineering Admissions',
                'Visa Assistance',
                'Pre-departure Guidance',
                'Accommodation Support',
                'Education Loans',
            ]
        }
    except Exception as e:
        logger.error(f"Error getting student context: {e}")
        return {}


# Simple in-memory conversation store
conversation_store = {}


def get_or_create_conversation(session_id: str, is_admin: bool = False):
    """Get or create a conversation memory for a session."""
    if session_id not in conversation_store:
        conversation_store[session_id] = {
            'history': [],  # Simple list of messages
            'is_admin': is_admin,
            'created_at': datetime.now(),
            'lead_data': {}
        }
    return conversation_store[session_id]


def format_chat_history(conversation, max_messages: int = 10) -> str:
    """Format chat history as a string for the prompt."""
    history = conversation['history']
    recent = history[-max_messages:] if len(history) > max_messages else history
    formatted = []
    for msg in recent:
        role = "Student" if msg['role'] == 'user' else "Assistant"
        formatted.append(f"{role}: {msg['content']}")
    return "\n".join(formatted)


class StudentChatView(APIView):
    """
    AI Chatbot for students - helps with admission queries and captures leads.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Process student chat message."""
        try:
            message = request.data.get('message', '').strip()
            session_id = request.data.get('session_id', str(uuid.uuid4()))
            
            if not message:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not GEMINI_API_KEY:
                return Response(
                    {'error': 'AI service not configured'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Get conversation and context
            conversation = get_or_create_conversation(session_id, is_admin=False)
            context = get_student_context()
            
            # Get RAG context for the query
            rag_context = ""
            try:
                from .rag import get_rag_store
                store = get_rag_store()
                rag_context = store.get_context_for_query(message, max_tokens=1500)
            except Exception as e:
                logger.warning(f"RAG search failed: {e}")
            
            # Build context strings
            countries_list = ', '.join([c.get('name', '') for c in context.get('countries', [])])
            colleges_info = ', '.join([f"{k}: {len(v)} colleges" for k, v in context.get('colleges_by_country', {}).items()])
            services_list = ', '.join(context.get('services', []))
            
            # Build RAG section
            rag_section = ""
            if rag_context:
                rag_section = f"""

RELEVANT KNOWLEDGE BASE INFORMATION:
{rag_context}

Use the above knowledge base information to provide accurate, detailed answers.
"""
            
            # Get formatted chat history
            chat_history = format_chat_history(conversation)
            history_section = ""
            if chat_history:
                history_section = f"""

PREVIOUS CONVERSATION:
{chat_history}
"""
            
            # Build the full prompt
            prompt = f"""You are Tejas, an expert education counselor for Intermost Study Abroad, helping students pursue MBBS abroad.

ABOUT INTERMOST:
- Premier study abroad consultancy based in India
- Specializes in MBBS admissions in Russia, Kazakhstan, Uzbekistan, Georgia, Nepal, Tajikistan, and Vietnam
- Provides end-to-end support: counseling, admission, visa, accommodation, and more
{rag_section}
AVAILABLE COUNTRIES: {countries_list}

COLLEGES BY COUNTRY: {colleges_info}

OUR SERVICES: {services_list}

YOUR ROLE:
1. Answer questions about studying abroad, MBBS programs, countries, and colleges
2. Provide accurate information about fees, eligibility, and admission process  
3. Be helpful, friendly, and encouraging
4. When appropriate, encourage students to share their contact details
5. Help students understand the benefits of studying abroad
{history_section}
Student: {message}

Respond helpfully and concisely:"""

            # Generate response using Gemini
            try:
                ai_response = generate_response(prompt)
            except Exception as gen_error:
                logger.warning(f"Gemini API error (student): {gen_error}")
                # Provide helpful fallback response
                ai_response = """Hi! I'm currently experiencing high demand. While I work on getting back online, here's how I can help you:

📞 **Contact us directly:** +91 91583 74434
📧 **Email:** info@intermoststudyabroad.com
🌐 **WhatsApp:** Click the WhatsApp button on this page

We specialize in MBBS admissions in Russia, Georgia, Uzbekistan, Kazakhstan, Tajikistan, Nepal, and Vietnam. Our team will be happy to assist you!"""
            
            # Save to conversation history
            conversation['history'].append({'role': 'user', 'content': message})
            conversation['history'].append({'role': 'assistant', 'content': ai_response})
            
            # Store conversation in MongoDB
            try:
                chat_collection = get_collection('chat_conversations')
                chat_collection.update_one(
                    {'session_id': session_id},
                    {
                        '$set': {'updated_at': datetime.now(), 'is_admin': False},
                        '$push': {
                            'messages': {
                                '$each': [
                                    {'id': str(uuid.uuid4()), 'role': 'user', 'content': message, 'timestamp': datetime.now()},
                                    {'id': str(uuid.uuid4()), 'role': 'assistant', 'content': ai_response, 'timestamp': datetime.now()}
                                ]
                            }
                        },
                        '$setOnInsert': {'created_at': datetime.now()}
                    },
                    upsert=True
                )
            except Exception as e:
                logger.warning(f"Failed to save conversation: {e}")
            
            return Response({
                'session_id': session_id,
                'message': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Student chat error: {e}")
            return Response(
                {'error': 'Failed to process message', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StudentLeadCaptureView(APIView):
    """
    Capture student lead data from chatbot.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Save student lead from chat."""
        try:
            session_id = request.data.get('session_id')
            lead_data = request.data.get('lead_data', {})
            
            if not session_id:
                return Response(
                    {'error': 'Session ID required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate required fields
            required = ['name', 'phone']
            missing = [f for f in required if not lead_data.get(f)]
            if missing:
                return Response(
                    {'error': f'Missing fields: {", ".join(missing)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create inquiry/lead
            inquiries = get_collection('inquiries')
            
            lead = {
                '_id': ObjectId(),
                'lead_id': str(uuid.uuid4()),
                'session_id': session_id,
                'name': lead_data.get('name', ''),
                'email': lead_data.get('email', ''),
                'phone': lead_data.get('phone', ''),
                'preferred_country': lead_data.get('preferred_country', ''),
                'course_interest': lead_data.get('course_interest', 'MBBS'),
                'message': lead_data.get('message', ''),
                'source': 'chatbot',
                'status': 'new',
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
            }
            
            inquiries.insert_one(lead)
            
            # Update chat conversation with lead info
            chat_collection = get_collection('chat_conversations')
            chat_collection.update_one(
                {'session_id': session_id},
                {
                    '$set': {
                        'lead_captured': True,
                        'lead_id': lead['lead_id'],
                        'lead_data': lead_data
                    }
                }
            )
            
            return Response({
                'success': True,
                'lead_id': lead['lead_id'],
                'message': 'Thank you! Our counselor will contact you soon.'
            })
            
        except Exception as e:
            logger.error(f"Lead capture error: {e}")
            return Response(
                {'error': 'Failed to save lead'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminChatView(APIView):
    """
    AI Chatbot for admin - provides insights and analytics.
    """
    permission_classes = [AllowAny]  # Changed for testing
    
    def post(self, request):
        """Process admin chat message."""
        try:
            message = request.data.get('message', '').strip()
            session_id = request.data.get('session_id', str(uuid.uuid4()))
            
            if not message:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not GEMINI_API_KEY:
                return Response(
                    {'error': 'AI service not configured'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Get conversation and database context
            conversation = get_or_create_conversation(session_id, is_admin=True)
            db_context = get_database_context()
            
            # Build admin context strings
            summary = db_context.get('summary', {})
            stats_str = f"Countries: {summary.get('total_countries', 0)}, Colleges: {summary.get('total_colleges', 0)}, Inquiries: {summary.get('total_inquiries', 0)}, Testimonials: {summary.get('total_testimonials', 0)}, Blogs: {summary.get('total_blogs', 0)}, News: {summary.get('total_news', 0)}, Team: {summary.get('total_team_members', 0)}"
            
            inquiry_stats = db_context.get('inquiry_stats', {})
            inquiry_str = f"Pending: {inquiry_stats.get('pending', 0)}, Contacted: {inquiry_stats.get('contacted', 0)}, Converted: {inquiry_stats.get('converted', 0)}"
            
            colleges_str = ', '.join([f"{k}: {v}" for k, v in db_context.get('colleges_per_country', {}).items()])
            
            recent_inqs = db_context.get('recent_inquiries', [])
            recent_str = '; '.join([f"{i.get('name', 'N/A')} - {i.get('preferred_country', 'N/A')} ({i.get('status', 'N/A')})" for i in recent_inqs[:5]])
            
            # Get formatted chat history
            chat_history = format_chat_history(conversation)
            history_section = ""
            if chat_history:
                history_section = f"""

PREVIOUS CONVERSATION:
{chat_history}
"""

            # Build the full prompt
            prompt = f"""You are an intelligent admin assistant for Intermost Study Abroad platform.
You have access to real-time database information and can provide insights.

CURRENT DATABASE STATISTICS:
{stats_str}

INQUIRY STATISTICS:
{inquiry_str}

AVAILABLE COUNTRIES: {', '.join(db_context.get('countries', []))}

COLLEGES PER COUNTRY: {colleges_str}

RECENT INQUIRIES (Last 5): {recent_str}

YOUR CAPABILITIES:
1. Provide insights about leads, conversions, and performance
2. Answer questions about database content
3. Suggest actions to improve conversions
4. Summarize inquiry trends
5. Help with content ideas for blogs/news
6. Provide recommendations for business growth
{history_section}
Admin: {message}

Respond professionally and concisely:"""

            # Generate response using Gemini
            try:
                ai_response = generate_response(prompt)
            except Exception as gen_error:
                logger.warning(f"Gemini API error (admin): {gen_error}")
                ai_response = "I'm currently unavailable due to high demand. Please try again in a few minutes or check the dashboard directly for insights."
            
            # Save to conversation history
            conversation['history'].append({'role': 'user', 'content': message})
            conversation['history'].append({'role': 'assistant', 'content': ai_response})
            
            # Store conversation in MongoDB
            try:
                chat_collection = get_collection('chat_conversations')
                chat_collection.update_one(
                    {'session_id': session_id},
                    {
                        '$set': {'updated_at': datetime.now(), 'is_admin': True},
                        '$push': {
                            'messages': {
                                '$each': [
                                    {'id': str(uuid.uuid4()), 'role': 'user', 'content': message, 'timestamp': datetime.now()},
                                    {'id': str(uuid.uuid4()), 'role': 'assistant', 'content': ai_response, 'timestamp': datetime.now()}
                                ]
                            }
                        },
                        '$setOnInsert': {'created_at': datetime.now()}
                    },
                    upsert=True
                )
            except Exception as e:
                logger.warning(f"Failed to save admin conversation: {e}")
            
            return Response({
                'session_id': session_id,
                'message': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Admin chat error: {e}")
            return Response(
                {'error': 'Failed to process message', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminInsightsView(APIView):
    """
    Get quick insights for admin dashboard.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current insights."""
        try:
            context = get_database_context()
            
            # Generate quick insights
            insights = []
            
            pending = context.get('inquiry_stats', {}).get('pending', 0)
            if pending > 0:
                insights.append({
                    'type': 'action',
                    'title': 'Pending Follow-ups',
                    'message': f'You have {pending} pending inquiries to follow up.',
                    'priority': 'high' if pending > 5 else 'medium'
                })
            
            total_inquiries = context.get('summary', {}).get('total_inquiries', 0)
            converted = context.get('inquiry_stats', {}).get('converted', 0)
            if total_inquiries > 0:
                conversion_rate = (converted / total_inquiries) * 100
                insights.append({
                    'type': 'metric',
                    'title': 'Conversion Rate',
                    'message': f'Current conversion rate: {conversion_rate:.1f}%',
                    'priority': 'info'
                })
            
            return Response({
                'insights': insights,
                'summary': context.get('summary', {}),
                'inquiry_stats': context.get('inquiry_stats', {}),
            })
            
        except Exception as e:
            logger.error(f"Insights error: {e}")
            return Response(
                {'error': 'Failed to get insights'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============= RAG Document Management Views =============

class RAGDocumentListView(APIView):
    """
    List and create RAG documents.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """List all RAG documents."""
        try:
            from .rag import get_rag_store
            
            store = get_rag_store()
            category = request.query_params.get('category', None)
            
            documents = store.list_documents(category=category)
            stats = store.get_stats()
            
            return Response({
                'documents': documents,
                'stats': stats,
            })
        except Exception as e:
            logger.error(f"Error listing documents: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """Add a new RAG document."""
        try:
            from .rag import get_rag_store
            
            title = request.data.get('title', '').strip()
            content = request.data.get('content', '').strip()
            category = request.data.get('category', 'general').strip()
            metadata = request.data.get('metadata', {})
            
            if not title or not content:
                return Response(
                    {'error': 'Title and content are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            store = get_rag_store()
            doc_id = store.add_document(
                title=title,
                content=content,
                category=category,
                metadata=metadata
            )
            
            return Response({
                'success': True,
                'document_id': doc_id,
                'message': f'Document "{title}" added successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RAGDocumentDetailView(APIView):
    """
    Get, update, or delete a single RAG document.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, document_id: str):
        """Get document details."""
        try:
            from .rag import get_rag_store
            
            store = get_rag_store()
            document = store.get_document(document_id)
            
            if not document:
                return Response(
                    {'error': 'Document not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response(document)
            
        except Exception as e:
            logger.error(f"Error getting document: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request, document_id: str):
        """Toggle document active status."""
        try:
            from .rag import get_rag_store
            
            is_active = request.data.get('is_active', True)
            
            store = get_rag_store()
            success = store.toggle_document(document_id, is_active)
            
            if not success:
                return Response(
                    {'error': 'Document not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                'success': True,
                'message': f'Document {"activated" if is_active else "deactivated"}'
            })
            
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, document_id: str):
        """Delete a document."""
        try:
            from .rag import get_rag_store
            
            store = get_rag_store()
            success = store.delete_document(document_id)
            
            if not success:
                return Response(
                    {'error': 'Document not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            return Response({
                'success': True,
                'message': 'Document deleted successfully'
            })
            
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RAGStatsView(APIView):
    """
    Get RAG document store statistics.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get stats."""
        try:
            from .rag import get_rag_store
            
            store = get_rag_store()
            stats = store.get_stats()
            
            return Response(stats)
            
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

