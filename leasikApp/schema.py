from django.db.models import Q

import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from .models import SentenceList


class SentenceListType(DjangoObjectType):
    class Meta:
        model = SentenceList
        interfaces = (relay.Node,)


class SentenceListConnection(relay.Connection):
    class Meta:
        node = SentenceListType


class Query(graphene.ObjectType):
    sentence_lists = relay.ConnectionField(SentenceListConnection)

    def resolve_sentence_lists(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return SentenceList.objects.filter(is_public=True)
        return SentenceList.objects.filter(
            Q(is_public=True) | Q(owner=info.context.user)
        )


class Mutation(graphene.ObjectType):
    pass
