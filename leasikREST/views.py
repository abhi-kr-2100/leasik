from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from leasikApp.models import Card, SentenceBookmark, SentenceList, Sentence
from leasikREST.permissions import OwnerOnly, OwnerOrPublicReadOnly
from leasikREST.filters import IsOwnerFilter, IsOwnerOrPublicFilter
from leasikREST.serializers import (
    CardSerializer,
    SentenceBookmarkSerializer,
    SentenceListSerializer,
    SentenceSerializer,
    UserSerializer,
)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CardViewSet(ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [OwnerOnly]
    filter_backends = [IsOwnerFilter]


class SentenceBookmarkViewSet(ModelViewSet):
    queryset = SentenceBookmark.objects.all()
    serializer_class = SentenceBookmarkSerializer
    permission_classes = [OwnerOnly]
    filter_backends = [IsOwnerFilter]


class SentenceListViewSet(ModelViewSet):
    queryset = SentenceList.objects.all()
    serializer_class = SentenceListSerializer
    permission_classes = [OwnerOrPublicReadOnly]
    filter_backends = [IsOwnerOrPublicFilter]


class SentenceViewSet(ModelViewSet):
    queryset = Sentence.objects.all()
    serializer_class = SentenceSerializer
