from django.urls import path, include
from rest_framework.routers import DefaultRouter

from leasikREST.views import (
    CardViewSet, SentenceViewSet, SentenceBookmarkViewSet, SentenceListViewSet
)


router = DefaultRouter()
router.register('cards', CardViewSet)
router.register('sentences', SentenceViewSet)
router.register('bookmarks', SentenceBookmarkViewSet)
router.register('lists', SentenceListViewSet)

app_name = 'leasikREST'
urlpatterns = [
    path('', include(router.urls))
]
