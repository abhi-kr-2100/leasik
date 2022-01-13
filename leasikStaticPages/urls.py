from django.urls import path

from .views import HomePageView


app_name = 'leasikStaticPages'
urlpatterns = [
    path('', HomePageView.as_view(), name='home-page')
]
