from django.urls import path
from .views import ImportContactsView, ContactsListView, SendMessageView

urlpatterns = [
    path('contacts/import/', ImportContactsView.as_view(), name='import_contacts'),
    path('contacts/', ContactsListView.as_view(), name='list_contacts'),
    path('send/', SendMessageView.as_view(), name='send_message'),
]
