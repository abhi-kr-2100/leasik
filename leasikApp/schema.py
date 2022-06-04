from django.db.models import Q

import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django import DjangoObjectType

from .models import Sentence, Card, SentenceList


class SentenceType(DjangoObjectType):
    class Meta:
        model = Sentence
        interfaces = (relay.Node,)


class SentenceConnection(relay.Connection):
    class Meta:
        node = SentenceType


class CardType(DjangoObjectType):
    class Meta:
        model = Card
        interfaces = (relay.Node,)
        fields = ("note", "owner", "sentence", "hidden_word_position")

    reviewable = graphene.Boolean()

    def resolve_reviewable(root, info):
        return root.is_up_for_review()


class CardConnection(relay.Connection):
    class Meta:
        node = CardType


class SentenceListType(DjangoObjectType):
    class Meta:
        model = SentenceList
        interfaces = (relay.Node,)


class SentenceListConnection(relay.Connection):
    class Meta:
        node = SentenceListType


class Query(graphene.ObjectType):
    sentences = relay.ConnectionField(SentenceConnection)
    cards = relay.ConnectionField(
        CardConnection,
        reviewable=graphene.Boolean(required=False),
        sentence_list_id=graphene.ID(required=False),
        randomize=graphene.Boolean(required=False, default_value=False),
    )
    sentence_lists = relay.ConnectionField(SentenceListConnection)

    def resolve_sentences(root, info, **kwargs):
        return Sentence.objects.all()

    def resolve_cards(
        root, info, randomize, reviewable=None, sentence_list_id=None, **kwargs
    ):
        if info.context.user.is_anonymous:
            return Card.objects.none()

        cards = Card.objects.filter(owner=info.context.user)
        if reviewable is not None:
            compatible_ids = [
                card.id for card in cards if card.is_up_for_review() == reviewable
            ]
            cards = cards.filter(id__in=compatible_ids)

        if sentence_list_id is not None:
            int_id = int(from_global_id(sentence_list_id)[1])
            cards = cards.filter(sentence__sentencelist__id=int_id)

        if randomize is True:
            cards = cards.order_by("?")

        return cards

    def resolve_sentence_lists(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return SentenceList.objects.filter(is_public=True)
        return SentenceList.objects.filter(
            Q(is_public=True) | Q(owner=info.context.user)
        )
