from django.urls import path
from . import views

urlpatterns = [
    path('zoom/oauth/init/', views.zoom_oauth_init, name='zoom_oauth_init'),
    path('zoom/oauth/callback/', views.zoom_oauth_callback, name='zoom_oauth_callback'),
]
