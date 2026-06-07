"""
Countries URL Configuration.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.CountryListCreateView.as_view(), name='country-list-create'),
    path('<str:country_id>/', views.CountryDetailView.as_view(), name='country-detail'),
    path('slug/<str:slug>/', views.CountryBySlugView.as_view(), name='country-by-slug'),
    path('<str:country_id>/features/', views.CountryFeaturesView.as_view(), name='country-features'),
    path('<str:country_id>/faqs/', views.CountryFAQsView.as_view(), name='country-faqs'),
]
