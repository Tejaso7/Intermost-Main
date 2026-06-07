from django.urls import path
from . import views

urlpatterns = [
    path('', views.NewsListCreateView.as_view(), name='news-list-create'),
    path('<str:news_id>/', views.NewsDetailView.as_view(), name='news-detail'),
]
