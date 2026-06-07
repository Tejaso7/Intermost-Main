"""
Analytics URL Configuration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Track pageview (called from frontend)
    path('track/', views.track_pageview, name='track_pageview'),
    
    # Analytics dashboard endpoints
    path('summary/', views.get_analytics_summary, name='analytics_summary'),
    path('visitors/', views.get_visitor_stats, name='visitor_stats'),
    path('pageviews/', views.get_pageview_stats, name='pageview_stats'),
    path('locations/', views.get_location_stats, name='location_stats'),
    path('pages/', views.get_top_pages, name='top_pages'),
    path('devices/', views.get_device_stats, name='device_stats'),
    path('realtime/', views.get_realtime_visitors, name='realtime_visitors'),
    path('trends/', views.get_trends, name='trends'),
]
