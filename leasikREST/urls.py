from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from leasikREST.views import (
    CardViewSet,
    SentenceViewSet,
    SentenceBookmarkViewSet,
    SentenceListViewSet,
    UserViewSet,
)


router = DefaultRouter()
router.register("cards", CardViewSet)
router.register("sentences", SentenceViewSet)
router.register("bookmarks", SentenceBookmarkViewSet)
router.register("lists", SentenceListViewSet)
router.register("users", UserViewSet)

app_name = "leasikREST"
urlpatterns = [path("", include(router.urls))]
urlpatterns += [
    path('api-token-auth/', obtain_auth_token)
]
