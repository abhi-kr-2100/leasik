from datetime import date

from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.settings import api_settings
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from leasikApp.models import Card, SentenceBookmark, SentenceList, Sentence
from leasikApp.helpers import get_cards, sm2
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

    @action(detail=False, url_path="playlist/(?P<list_pk>[^/.]+)")
    def playlist(self, request: Request, list_pk: int) -> Response:
        """Return Cards from given list that the logged-in user should play."""

        num_cards = int(request.query_params.get("num_cards", api_settings.PAGE_SIZE))
        sentence_list: SentenceList = SentenceList.objects.get(pk=list_pk)
        sentences = list(sentence_list.sentences.all())

        cards = get_cards(request.user, sentences, num_cards)

        return Response(CardSerializer(cards, many=True).data)

    @action(methods=['POST'], detail=True)
    def updateUsingSM2(self, request: Request, pk: int) -> Response:
        card: Card = self.get_object()
        score = request.data.get('score')

        if score is None:
            return Response(
                { 'error': 'score is required' },
                status=HTTP_400_BAD_REQUEST
            )

        if not isinstance(score, int):
            return Response(
                { 'error': 'score must be an integer' },
                status=HTTP_400_BAD_REQUEST
            )

        if not 0 <= score <= 5:
            return Response(
                { 'error': 'score must be in range [0, 5]' },
                status=HTTP_400_BAD_REQUEST
            )

        n, ef, i = sm2(
            score,
            card.repetition_number,
            card.easiness_factor,
            card.inter_repetition_interval
        )

        Card.objects.filter(pk=pk).update(
            repetition_number=n,
            easiness_factor=ef,
            inter_repetition_interval=i,
            last_review_date=date.today(),
        )

        return Response({ 'status': 'Updated' })


class SentenceBookmarkViewSet(ModelViewSet):
    queryset = SentenceBookmark.objects.all()
    serializer_class = SentenceBookmarkSerializer
    permission_classes = [OwnerOnly]
    filter_backends = [IsOwnerFilter]

    @action(detail=False, url_path="isBookmarked/(?P<list_pk>[^/.]+)/(?P<sentence_pk>[^/.]+)")
    def isBookmarked(self, request: Request, list_pk: int, sentence_pk: int) -> Response:
        sentence_list = SentenceList.objects.get(pk=list_pk)
        bookmark: SentenceBookmark = SentenceBookmark.objects.get(
            owner=request.user, sentence_list=sentence_list)
        sentence = Sentence.objects.get(pk=sentence_pk)

        return Response({ 'result': sentence in bookmark.sentences.all() })


class SentenceListViewSet(ModelViewSet):
    queryset = SentenceList.objects.all()
    serializer_class = SentenceListSerializer
    permission_classes = [OwnerOrPublicReadOnly]
    filter_backends = [IsOwnerOrPublicFilter]


class SentenceViewSet(ModelViewSet):
    queryset = Sentence.objects.all()
    serializer_class = SentenceSerializer
