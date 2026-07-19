"""
Core URL Configuration.
Includes authentication endpoints and health checks.
"""

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

urlpatterns = [
    # Health Check
    path('health/', views.health_check, name='health-check'),
    path('db-health/', views.db_health_check, name='db-health-check'),
    
    # Authentication
    path('auth/login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('auth/verify-otp/', views.AdminVerifyOTPView.as_view(), name='admin_verify_otp'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/config-send-otp/', views.ConfigSendOTPView.as_view(), name='config_send_otp'),
    path('auth/config-verify-otp/', views.ConfigVerifyOTPView.as_view(), name='config_verify_otp'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    
    # Site Settings
    path('settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('settings/env/', views.EnvConfigView.as_view(), name='env-settings'),
    path('stats/', views.StatsView.as_view(), name='stats'),
    
    # YouTube Shorts
    path('shorts/', views.YouTubeShortListCreateView.as_view(), name='shorts-list-create'),
    path('shorts/<str:short_id>/', views.YouTubeShortDetailView.as_view(), name='shorts-detail'),

    # Student Glimpses / Real Student Journeys
    path('glimpses/', views.GlimpseListCreateView.as_view(), name='glimpses-list-create'),
    path('glimpses/<str:glimpse_id>/', views.GlimpseDetailView.as_view(), name='glimpses-detail'),

    # Brochures / Prospectuses
    path('brochures/', views.BrochureListCreateView.as_view(), name='brochures-list-create'),
    path('brochures/<str:brochure_id>/', views.BrochureDetailView.as_view(), name='brochures-detail'),
    path('brochures/<str:brochure_id>/download/', views.BrochureDownloadIncrementView.as_view(), name='brochures-download'),
]
