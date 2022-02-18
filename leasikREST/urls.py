from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from leasikREST.views import (
    CardViewSet,
    BookmarkViewSet,
    SentenceListViewSet,
)


router = DefaultRouter()
router.register("cards", CardViewSet)
router.register("bookmarks", BookmarkViewSet)
router.register("lists", SentenceListViewSet)

app_name = "leasikREST"
urlpatterns = [
    path("", include(router.urls)),
    path("api-token-auth/", obtain_auth_token)
]
