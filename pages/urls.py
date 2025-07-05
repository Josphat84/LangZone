# pages/urls.py (Original good state with router)


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views
from .views import TutorCreateView
from .views import TutorViewSet
from django.http import HttpResponse


router = DefaultRouter()
router.register(r'tutors', TutorViewSet)

def landing(request):
    return HttpResponse("Backend running. React app is at http://localhost:3000")


urlpatterns = [
    # These are your API views that start with 'api/'
    path('', landing),
    path('', views.index, name='home'),  # Add this line
    path('api/home/', api_views.home_api_view, name='home_api'),
    path('api/about/', api_views.about_api_view, name='about_api'),
    path('api/contact/', api_views.contact_api_view, name='contact_api'),
    path('api/', include(router.urls)), # This includes /api/tutors/ etc.




]


# You might also have non-API paths in this same file if the 'pages' app also serves regular pages
# Example:
# urlpatterns += [
#     path('', views.home_page_view, name='home'),
#     path('about/', views.AboutPageView.as_view(), name='about'),
# ]