from django.urls import path
from . import views
from . import apk_views

urlpatterns = [
    path('', views.InquiryListCreateView.as_view(), name='inquiry-list-create'),
    path('import/', views.InquiryImportView.as_view(), name='inquiry-import'),
    path('campaign/', views.EmailCampaignView.as_view(), name='inquiry-campaign'),
    path('drips/', views.LeadDripCampaignView.as_view(), name='inquiry-drips'),
    path('subscribe/otp/send/', views.SendOTPView.as_view(), name='subscribe-otp-send'),
    path('subscribe/otp/verify/', views.VerifyOTPView.as_view(), name='subscribe-otp-verify'),
    path('<str:inquiry_id>/', views.InquiryDetailView.as_view(), name='inquiry-detail'),
    path('<str:inquiry_id>/status/', views.InquiryStatusView.as_view(), name='inquiry-status'),
    path('stats/overview/', views.InquiryStatsView.as_view(), name='inquiry-stats'),
    
    # APK Auto-dialer & Cold Calling Endpoints
    path('apk/v1/login/', apk_views.APKLoginView.as_view(), name='apk-login'),
    path('apk/v1/leads/', apk_views.APKLeadsView.as_view(), name='apk-leads'),
    path('apk/v1/call-log/', apk_views.APKCallLogView.as_view(), name='apk-call-log'),
    path('apk/users/', apk_views.APKUsersView.as_view(), name='apk-users-admin'),
    path('cold-leads/', apk_views.ColdLeadsView.as_view(), name='cold-leads-admin'),
    path('cold-leads/import/', apk_views.ColdLeadsImportView.as_view(), name='cold-leads-import-admin'),
    path('cold-leads/assign/', apk_views.ColdLeadsAssignView.as_view(), name='cold-leads-assign-admin'),
]
