"""
URL configuration for Intermost Backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API Documentation Schema
schema_view = get_schema_view(
    openapi.Info(
        title="Intermost Study Abroad API",
        default_version='v1',
        description="Complete API for Intermost Study Abroad Platform",
        terms_of_service="https://intermost.in/terms/",
        contact=openapi.Contact(email="admissionintermost@gmail.com"),
        license=openapi.License(name="Private License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/v1/', include('apps.core.urls')),
    path('api/v1/countries/', include('apps.countries.urls')),
    path('api/v1/colleges/', include('apps.colleges.urls')),
    path('api/v1/testimonials/', include('apps.testimonials.urls')),
    path('api/v1/blogs/', include('apps.blogs.urls')),
    path('api/v1/inquiries/', include('apps.inquiries.urls')),
    path('api/v1/news/', include('apps.news.urls')),
    path('api/v1/team/', include('apps.team.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/uploads/', include('apps.uploads.urls')),
    path('api/v1/chat/', include('apps.chat.urls')),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve static/media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
