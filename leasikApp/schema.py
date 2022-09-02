from django.db.models import Q

import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django import DjangoObjectType

from .models import Sentence, SentenceList, UserProfile, WordCard


class SentenceType(DjangoObjectType):
    class Meta:
        model = Sentence
        interfaces = (relay.Node,)


class SentenceConnection(relay.Connection):
    class Meta:
        node = SentenceType


class SentenceListType(DjangoObjectType):
    class Meta:
        model = SentenceList
        interfaces = (relay.Node,)


class SentenceListConnection(relay.Connection):
    class Meta:
        node = SentenceListType


class WordCardType(DjangoObjectType):
    class Meta:
        model = WordCard
        interfaces = (relay.Node,)
        fields = ("owner", "sentence_list", "word")

    sentences = graphene.ConnectionField(SentenceConnection)

    def resolve_sentences(root, info):
        return Sentence.objects.filter(
            text__iregex=rf"(?:^|\W){root.word}(?:$|\W)"
        )


class WordCardConnection(relay.Connection):
    class Meta:
        node = WordCardType


class Query(graphene.ObjectType):
    sentence_lists = relay.ConnectionField(SentenceListConnection)
    word_cards = relay.ConnectionField(
        WordCardConnection, sentence_list_id=graphene.ID(required=True)
    )

    def resolve_sentence_lists(root, info, **kwargs):
        if info.context.user.is_anonymous:
            return SentenceList.objects.filter(is_public=True)
        return SentenceList.objects.filter(
            Q(is_public=True) | Q(owner=info.context.user)
        )

    def resolve_word_cards(root, info, sentence_list_id, **kwargs):
        if info.context.user.is_anonymous:
            raise Exception("Not authenticated")

        user_profile = UserProfile.objects.get(owner=info.context.user)
        sl_int_id = int(from_global_id(sentence_list_id)[1])
        sl = SentenceList.objects.get(id=sl_int_id)
        if not user_profile.played_lists.contains(sl):
            sl.prepare_word_cards(info.context.user)
            user_profile.played_lists.add(sl)

        return WordCard.objects.filter(
            sentence_list=sl, owner=info.context.user
        ).order_by(
            "easiness_factor", "-last_review_date", "inter_repetition_interval"
        )  # TODO: Replace with a proper check on
        # whether the card is up for review


class Mutation(graphene.ObjectType):
    pass
