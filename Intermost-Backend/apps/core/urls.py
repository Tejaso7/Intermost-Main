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
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    
    # Site Settings
    path('settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('stats/', views.StatsView.as_view(), name='stats'),
]
