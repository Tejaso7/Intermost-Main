from django.urls import path
from . import views

urlpatterns = [
    path('', views.BlogListCreateView.as_view(), name='blog-list-create'),
    path('<str:blog_id>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('slug/<str:slug>/', views.BlogBySlugView.as_view(), name='blog-by-slug'),
    path('category/<str:category>/', views.BlogsByCategoryView.as_view(), name='blogs-by-category'),
]
