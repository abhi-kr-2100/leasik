from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('leasikAPI.urls', namespace='leasikAPI')),
    path('', include('leasikStaticPages.urls', namespace='leasikStaticPages')),
    path('lists/', include('leasikApp.urls', namespace='leasikApp')),
    path('accounts/', include('allauth.urls')),
    path('logout', LogoutView.as_view())
]
