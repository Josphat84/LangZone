#pages/views.py

from django.shortcuts import render
from django.views.generic import TemplateView
from .documents import PageDocument, ProductDocument
from django.db.models import Q
from rest_framework import generics
from .models import Tutor
from .serializers import TutorSerializer
from rest_framework import viewsets
from django.http import HttpResponse


def index(request):
    return HttpResponse("Backend running. React app is at http://localhost:3000")


# Importing necessary modules and classes

# Defining a search view for pages and products

def search_view(request):
    query = request.GET.get('q', '')
    page_results = []
    product_results = []

    

    if query:
        page_results = PageDocument.search().query("multi_match", query=query, fields=['title', 'content'])
        product_results = ProductDocument.search().query("multi_match", query=query, fields=['name', 'description'])

    context = {
        'query': query,
        'page_results': page_results,
        'product_results': product_results,
    }
    
    return render(request, 'pages/search_results.html', context)


# HomePageView

def home_page_view(request):
    context = {
        "Inventory list": ["Widget 1", "Widget 2", "Widget 3"],
        "Greeting": "ThAnk yoU fOr vIsiting",
    }
    return render(request, "home.html", context)



# AboutPageView
class AboutPageView(TemplateView):
    template_name = "about.html"

    # Add getting context data
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["contact_address"] = "1481 Mt Pleasant, Harare."
        context["contact_email"] = "lnjsoftware@gmail.com"  
        context["contact_phone"] = "+263 77 897 3142"
        return context

# ContactPageView
class ContactPageView(TemplateView):
    template_name = "contacts.html"

# BlogPageView
class BlogPageView(TemplateView):
    template_name = "blog.html"

# DealsPageView
class DealsPageView(TemplateView):
    template_name = "deals.html"

# FeaturedPageView
class FeaturedPageView(TemplateView):
    template_name = "featured.html"

# NewArrivalsPageView
class NewArrivalsPageView(TemplateView):
    template_name = "arrivals.html"

# ShopPageView
class ShopPageView(TemplateView):
    template_name = "shop.html"

# PrivacyPolicyPageView
class PrivacyPolicyPageView(TemplateView):
    template_name = "privacy_policy.html"

# TermsAndConditionsPageView
class TermsAndConditionsPageView(TemplateView):
    template_name = "terms_and_conditions.html"

#ShippingPolicyPageView
class ShippingPolicyPageView(TemplateView):
    template_name = "shipping_policy.html"

# BestSellersPageView
class BestSellersPageView(TemplateView):
    template_name = "best_sellers.html"

# ItemsOnSalePageView
class ItemsOnSalePageView(TemplateView):
    template_name = "items_on_sale.html"

# MyAccountPageView
class MyAccountPageView(TemplateView):
    template_name = "my_account.html"

# OrderTrackingPageView
class OrderTrackingPageView(TemplateView):
    template_name = "order_tracking.html"

# ReturnsAndExchangesPageView
class ReturnsAndExchangesPageView(TemplateView):
    template_name = "returns_and_exchanges.html"

# FAQPageView
class FAQPageView(TemplateView):
    template_name = "faq.html"

# HelpCenterPageView
class HelpCenterPageView(TemplateView):
    template_name = "help_center.html"

# LoginPageView
class LoginPageView(TemplateView):
    template_name = "login.html"




class TutorCreateView(generics.CreateAPIView):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer



class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer



def index(request):
    return HttpResponse("Backend running. React app is at http://localhost:3000")
