from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SentenceListViewSet, SentenceViewSet, SentenceNoteViewSet


router = DefaultRouter()
router.register('lists', SentenceListViewSet, basename='SentenceList')
router.register('sentences', SentenceViewSet, basename='Sentence')
router.register('notes', SentenceNoteViewSet, basename='SentenceNote')


app_name = 'leasikAPI'
urlpatterns = [
    path('', include(router.urls), name='lists')
]
