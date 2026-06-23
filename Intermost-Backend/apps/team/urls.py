from django.urls import path
from . import views

urlpatterns = [
    path('', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('offices/', views.OfficeListView.as_view(), name='office-list'),
    path('offices/<str:office_id>/', views.OfficeDetailView.as_view(), name='office-detail'),
    path('<str:member_id>/', views.TeamDetailView.as_view(), name='team-detail'),
]
