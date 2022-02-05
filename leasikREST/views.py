from rest_framework.viewsets import ModelViewSet

from leasikApp.models import Card, SentenceBookmark, SentenceList, Sentence
from leasikREST.serializers import (
    CardSerializer, SentenceBookmarkSerializer, SentenceListSerializer,
    SentenceSerializer
)


class CardViewSet(ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer


class SentenceBookmarkViewSet(ModelViewSet):
    queryset = SentenceBookmark.objects.all()
    serializer_class = SentenceBookmarkSerializer


class SentenceListViewSet(ModelViewSet):
    queryset = SentenceList.objects.all()
    serializer_class = SentenceListSerializer


class SentenceViewSet(ModelViewSet):
    queryset = Sentence.objects.all()
    serializer_class = SentenceSerializer
