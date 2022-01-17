from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SentenceListViewSet, SentenceViewSet


router = DefaultRouter()
router.register('lists', SentenceListViewSet, basename='SentenceList')
router.register('sentences', SentenceViewSet, basename='Sentence')


app_name = 'leasikAPI'
urlpatterns = [
    path('', include(router.urls), name='lists')
]
