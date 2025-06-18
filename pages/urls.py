from django.urls import path
from . import views
from . import api_views




urlpatterns = [

    path('api/home/', api_views.home_api_view, name='home_api'),
    path('api/about/', api_views.about_api_view, name='about_api'),
    path('api/contact/', api_views.contact_api_view, name='contact_api'),
    path('api/blog/', api_views.blog_api_view, name='blog_api'),



]   