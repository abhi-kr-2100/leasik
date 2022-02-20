from datetime import date
from typing import List

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.settings import api_settings
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from leasikApp.models import Card, Bookmark, SentenceList
from leasikApp.helpers import get_cards, sm2
from leasikREST.permissions import OwnerOnly, OwnerOrPublicReadOnly
from leasikREST.filters import (
    IsOwnerFilter,
    IsOwnerOrPublicFilter,
    SentenceListFilter,
)
from leasikREST.serializers import (
    CardSerializer,
    BookmarkSerializer,
    SentenceListSerializer,
)


class CardViewSet(ModelViewSet):
    """Allow CRUD requests to be made for the Card object.

    Additionally, handle the following requests:
        * get cards that are up for review.
        * replace a card with other cards with given hidden_word_positions
        * update proficiency of a card using the SM-2 algorithm
    """

    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [OwnerOnly]
    filter_backends = [IsOwnerFilter]

    @action(detail=False, url_path="playlist/(?P<list_pk>[^/.]+)")
    def playlist(self, request: Request, list_pk: int) -> Response:
        """Return Cards from given list that the logged-in user should play."""
        num_cards = int(
            request.query_params.get("num_cards", api_settings.PAGE_SIZE)
        )
        sentence_list: SentenceList = SentenceList.objects.get(pk=list_pk)
        sentences = list(sentence_list.sentences.all())

        cards = get_cards(request.user, sentences, num_cards)

        return Response(CardSerializer(cards, many=True).data)

    @action(methods=["POST"], detail=True)
    def replaceWithNewCards(self, request: Request, pk: int) -> Response:
        """Replace Card with given cards with the given hidden_word_positions.

        The POST data must contain a "hiddenWordPositions" property that is an
        array of integers.
        """
        owner = request.user

        card: Card = self.get_object()
        hidden_word_positions: List[int] = request.data.get(
            "hiddenWordPositions"
        )

        sentence = card.sentence
        sentence.card_set.all().delete()
        sentence.card_set.bulk_create(
            Card(owner=owner, sentence=sentence, hidden_word_position=h)
            for h in hidden_word_positions
        )

        return Response(
            CardSerializer(sentence.card_set.all(), many=True).data
        )

    @action(methods=["POST"], detail=True)
    def updateUsingSM2(self, request: Request, pk: int) -> Response:
        """Update the proficiency of Card using the SM-2 algorithm.

        An integer "score" in the range [0, 5] must be provided in the request
        body.
        """
        card: Card = self.get_object()
        score = request.data.get("score")

        if score is None:
            return Response(
                {"error": "score is required"}, status=HTTP_400_BAD_REQUEST
            )

        if not isinstance(score, int):
            return Response(
                {"error": "score must be an integer"},
                status=HTTP_400_BAD_REQUEST,
            )

        if not 0 <= score <= 5:
            return Response(
                {"error": "score must be in range [0, 5]"},
                status=HTTP_400_BAD_REQUEST,
            )

        n, ef, i = sm2(
            score,
            card.repetition_number,
            card.easiness_factor,
            card.inter_repetition_interval,
        )

        Card.objects.filter(pk=pk).update(
            repetition_number=n,
            easiness_factor=ef,
            inter_repetition_interval=i,
            last_review_date=date.today(),
        )

        return Response({"status": "Updated"})


class BookmarkViewSet(ModelViewSet):
    """View to interact with Bookmarks.

    CRUD methods are not supposed to be used with BookmarkViewSet. Instead, it
    provides custom actions to do the following:
        * get all cards that are bookmarked to a list by the authenticated user
        * test whether a card is bookmarked to a list by the authenticated user
        * add/remove Bookmarks from a SentenceList
    """

    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [OwnerOnly]
    filter_backends = [IsOwnerFilter, SentenceListFilter]

    @action(detail=False, url_path="forList/(?P<list_pk>[^/.]+)")
    def forList(self, request: Request, list_pk: int) -> Response:
        """Get cards that are bookmarked to the given list."""
        sentence_list = SentenceList.objects.get(pk=list_pk)
        bookmark: Bookmark = Bookmark.objects.get_or_create(
            owner=request.user, sentence_list=sentence_list
        )[0]
        cards = bookmark.cards.all()

        return Response(CardSerializer(cards, many=True).data)

    @action(
        detail=False,
        url_path="isBookmarked/(?P<list_pk>[^/.]+)/(?P<card_pk>[^/.]+)",
    )
    def isBookmarked(
        self, request: Request, list_pk: int, card_pk: int
    ) -> Response:
        sentence_list = SentenceList.objects.get(pk=list_pk)
        bookmark: Bookmark = Bookmark.objects.get_or_create(
            owner=request.user, sentence_list=sentence_list
        )[0]
        card = Card.objects.get(pk=card_pk)

        return Response({"result": card in bookmark.cards.all()})

    @action(
        methods=["POST"],
        detail=False,
        url_path="add/(?P<list_pk>[^/.]+)/(?P<card_pk>[^/.]+)",
    )
    def add(self, request: Request, list_pk: int, card_pk: int) -> Response:
        sentence_list = SentenceList.objects.get(pk=list_pk)
        bookmark: Bookmark = Bookmark.objects.get_or_create(
            owner=request.user, sentence_list=sentence_list
        )[0]
        card = Card.objects.get(pk=card_pk)

        bookmark.cards.add(card)

        return Response({"status": "created"})

    @action(
        methods=["DELETE"],
        detail=False,
        url_path="remove/(?P<list_pk>[^/.]+)/(?P<card_pk>[^/.]+)",
    )
    def remove(self, request: Request, list_pk: int, card_pk: int) -> Response:
        sentence_list = SentenceList.objects.get(pk=list_pk)
        bookmark: Bookmark = Bookmark.objects.get_or_create(
            owner=request.user, sentence_list=sentence_list
        )[0]
        card = Card.objects.get(pk=card_pk)

        bookmark.cards.remove(card)

        return Response({"status": "removed"})


class SentenceListViewSet(ModelViewSet):
    queryset = SentenceList.objects.all()
    serializer_class = SentenceListSerializer
    permission_classes = [OwnerOrPublicReadOnly]
    filter_backends = [IsOwnerOrPublicFilter]
