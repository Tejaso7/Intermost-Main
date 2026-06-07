from django.urls import path
from . import views

urlpatterns = [
    path('', views.InquiryListCreateView.as_view(), name='inquiry-list-create'),
    path('<str:inquiry_id>/', views.InquiryDetailView.as_view(), name='inquiry-detail'),
    path('<str:inquiry_id>/status/', views.InquiryStatusView.as_view(), name='inquiry-status'),
    path('stats/overview/', views.InquiryStatsView.as_view(), name='inquiry-stats'),
]
