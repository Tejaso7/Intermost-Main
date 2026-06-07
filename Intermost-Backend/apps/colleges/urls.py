"""
Colleges URL Configuration.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.CollegeListCreateView.as_view(), name='college-list-create'),
    path('<str:college_id>/', views.CollegeDetailView.as_view(), name='college-detail'),
    path('country/<str:country_slug>/', views.CollegesByCountryView.as_view(), name='colleges-by-country'),
    path('<str:college_id>/gallery/', views.CollegeGalleryView.as_view(), name='college-gallery'),
]
