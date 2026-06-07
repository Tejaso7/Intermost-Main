"""
Chat URL routes.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Public chatbot for students
    path('student/', views.StudentChatView.as_view(), name='student-chat'),
    path('student/lead/', views.StudentLeadCaptureView.as_view(), name='student-lead'),
    
    # Admin chatbot for insights
    path('admin/', views.AdminChatView.as_view(), name='admin-chat'),
    path('admin/insights/', views.AdminInsightsView.as_view(), name='admin-insights'),
    
    # RAG Document Management (Admin only)
    path('documents/', views.RAGDocumentListView.as_view(), name='rag-documents'),
    path('documents/<str:document_id>/', views.RAGDocumentDetailView.as_view(), name='rag-document-detail'),
    path('documents/stats/', views.RAGStatsView.as_view(), name='rag-stats'),
]
