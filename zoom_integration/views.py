import requests
from django.shortcuts import redirect
from django.conf import settings
from urllib.parse import urlencode

def zoom_oauth_init(request):
    zoom_auth_url = "https://zoom.us/oauth/authorize"
    params = {
        "response_type": "code",
        "client_id": settings.ZOOM_CLIENT_ID,
        "redirect_uri": settings.ZOOM_REDIRECT_URI
    }
    return redirect(f"{zoom_auth_url}?{urlencode(params)}")

def zoom_oauth_callback(request):
    code = request.GET.get("code")
    token_url = "https://zoom.us/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.ZOOM_REDIRECT_URI
    }
    headers = {
        "Authorization": f"Basic {settings.ZOOM_AUTH_HEADER}"
    }
    response = requests.post(token_url, data=payload, headers=headers)
    data = response.json()

    # Save access_token and refresh_token to the tutor's profile
    return redirect("/")
