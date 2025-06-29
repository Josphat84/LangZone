# File: pages/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views
from .views import TutorCreateView
from .views import TutorViewSet


router = DefaultRouter()
router.register(r'tutors', TutorViewSet)   



urlpatterns = [

    path('api/home/', api_views.home_api_view, name='home_api'),
    path('api/about/', api_views.about_api_view, name='about_api'),
    path('api/contact/', api_views.contact_api_view, name='contact_api'),
    path('api/blog/', api_views.blog_api_view, name='blog_api'),
   # path('api/tutors/', TutorCreateView.as_view(), name='create-tutor'),
    path('api/', include(router.urls)),  # Include the router's URLs for the Tutor API

]   