from django.db.models import Q

import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from .models import Sentence, SentenceList


class SentenceType(DjangoObjectType):
    class Meta:
        model = Sentence
        interfaces = (relay.Node,)


class SentenceListType(DjangoObjectType):
    class Meta:
        model = SentenceList
        interfaces = (relay.Node,)


class SentenceConnection(relay.Connection):
    class Meta:
        node = SentenceType


class SentenceListConnection(relay.Connection):
    class Meta:
        node = SentenceListType


class Query(graphene.ObjectType):
    sentences = relay.ConnectionField(SentenceConnection)
    sentence_lists = relay.ConnectionField(SentenceListConnection)

    def resolve_sentences(root, info, **kwargs):
        return Sentence.objects.all()

    def resolve_sentence_lists(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return SentenceList.objects.filter(is_public=True)
        return SentenceList.objects.filter(
            Q(is_public=True) | Q(owner=info.context.user)
        )


class Mutation(graphene.ObjectType):
    pass
