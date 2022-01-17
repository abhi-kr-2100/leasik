from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProficiencyViewSet, SentenceListViewSet, SentenceViewSet,
    SentenceNoteViewSet
)


router = DefaultRouter()
router.register('lists', SentenceListViewSet, basename='SentenceList')
router.register('sentences', SentenceViewSet, basename='Sentence')
router.register('notes', SentenceNoteViewSet, basename='SentenceNote')
router.register('proficiencies', ProficiencyViewSet, basename='Proficiency')


app_name = 'leasikAPI'
urlpatterns = [
    path('', include(router.urls), name='lists')
]
