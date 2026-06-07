"""
URL patterns for uploads API.
"""

from django.urls import path
from .views import FileUploadView, FileDeleteView, FileListView

urlpatterns = [
    path('', FileUploadView.as_view(), name='upload'),
    path('delete/', FileDeleteView.as_view(), name='delete'),
    path('list/', FileListView.as_view(), name='list'),
]
