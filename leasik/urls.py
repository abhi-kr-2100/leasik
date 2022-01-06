from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('lists/', include('leasikApp.urls', namespace='leasikApp')),
    path('accounts/', include('allauth.urls')),
    path('logout', LogoutView.as_view())
]
