from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.settings import api_settings
from rest_framework.request import Request
from rest_framework.response import Response

from leasikApp.models import Card, SentenceBookmark, SentenceList, Sentence
from leasikApp.helpers import get_cards
from leasikREST.permissions import OwnerOnly, OwnerOrPublicReadOnly
from leasikREST.filters import IsOwnerFilter, IsOwnerOrPublicFilter
from leasikREST.serializers import (
    CardSerializer,
    NestedCardSerializer,
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

    @action(detail=False, url_path='playlist/(?P<list_pk>[^/.]+)')
    def playlist(self, request: Request, list_pk: int) -> Response:
        """Return Cards from given list that the logged-in user should play."""

        num_cards = int(request.query_params.get('num_cards', api_settings.PAGE_SIZE))
        sentence_list: SentenceList = SentenceList.objects.get(pk=list_pk)
        sentences = list(sentence_list.sentences.all())

        cards = get_cards(request.user, sentences, num_cards)

        return Response(NestedCardSerializer(cards, many=True).data)


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
