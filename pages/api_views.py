# API Views
# pages/api_views.py


from django.http import JsonResponse


def home_api_view(request):
    """
    API view to return a simple JSON response for the home page.
    """
    data = {
        "message": "Welcome to the Home Page API",
        "inventory": ["Widget 1", "Widget 2", "Widget 3"],
        "greeting": "Thank you for visiting",
    }
    return JsonResponse(data)

def about_api_view(request):
    """
    API view to return contact information for the About page.
    """
    data = {
        "contact_address": "1481 Mt Pleasant, Harare.",
        "contact_email": "info@ljshop.com"
    }
    return JsonResponse(data)

def contact_api_view(request):
    """
    API view to return contact information for the Contact page.
    """
    data = {
        "contact_address": "1481 Mt Pleasant, Harare.",
        "contact_email": "info@ljshop.com"
    }
    return JsonResponse(data)


def blog_api_view(request):
    """
    API view to return a simple JSON response for the blog page.
    """
    data = {
        "message": "Welcome to the Blog Page API",
        "posts": [
            {"title": "First Post", "content": "This is the content of the first post."},
            {"title": "Second Post", "content": "This is the content of the second post."}
        ]
    }
    return JsonResponse(data)   


