from django.urls import path
from .views import ImportContactsView, ContactsListView, SendMessageView, WhatsAppConfigView, WhatsAppCampaignView

urlpatterns = [
    path('contacts/import/', ImportContactsView.as_view(), name='import_contacts'),
    path('contacts/', ContactsListView.as_view(), name='list_contacts'),
    path('send/', SendMessageView.as_view(), name='send_message'),
    path('config/', WhatsAppConfigView.as_view(), name='whatsapp_config'),
    path('campaign/', WhatsAppCampaignView.as_view(), name='whatsapp_campaign'),
]
