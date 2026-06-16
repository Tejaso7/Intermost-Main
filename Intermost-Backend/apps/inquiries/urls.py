from django.urls import path
from . import views

urlpatterns = [
    path('', views.InquiryListCreateView.as_view(), name='inquiry-list-create'),
    path('import/', views.InquiryImportView.as_view(), name='inquiry-import'),
    path('campaign/', views.EmailCampaignView.as_view(), name='inquiry-campaign'),
    path('subscribe/otp/send/', views.SendOTPView.as_view(), name='subscribe-otp-send'),
    path('subscribe/otp/verify/', views.VerifyOTPView.as_view(), name='subscribe-otp-verify'),
    path('<str:inquiry_id>/', views.InquiryDetailView.as_view(), name='inquiry-detail'),
    path('<str:inquiry_id>/status/', views.InquiryStatusView.as_view(), name='inquiry-status'),
    path('stats/overview/', views.InquiryStatsView.as_view(), name='inquiry-stats'),
]
