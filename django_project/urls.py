# django_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    
    path("admin/", admin.site.urls),
    # Include all URLs from the 'pages' app, including its API paths
    # This is the most direct way to get /api/tutors/ working if it's in pages/urls.py
    path("", include("pages.urls")),
    path("accounts/", include("allauth.urls")),
]