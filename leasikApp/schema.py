from django.db.models import Q

import graphene
from graphene import relay
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
    cards = relay.ConnectionField(CardConnection)
    sentence_lists = relay.ConnectionField(SentenceListConnection)

    def resolve_sentences(root, info, **kwargs):
        return Sentence.objects.all()

    def resolve_cards(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return Card.objects.none()
        return Card.objects.filter(owner=info.context.user)

    def resolve_sentence_lists(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return SentenceList.objects.filter(is_public=True)
        return SentenceList.objects.filter(
            Q(is_public=True) | Q(owner=info.context.user)
        )
