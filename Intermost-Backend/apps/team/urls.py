from django.urls import path
from . import views

urlpatterns = [
    path('', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('<str:member_id>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('offices/', views.OfficeListView.as_view(), name='office-list'),
]
