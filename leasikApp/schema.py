from typing import Iterable
import re
from datetime import date
from string import digits, punctuation, whitespace

from django.db.models import Q, F
from django.conf import settings

import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django import DjangoObjectType

from icu import Locale, UnicodeString

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

    # The sentences that contain this word
    sentences = graphene.ConnectionField(SentenceConnection)

    def resolve_sentences(root, info, **kwargs):
        """Return only those sentences which contain the whole root.word."""
        
        # Randomize the order of search_space so that the user doesn't see
        # the same sentences mapped to a word
        search_space: Iterable[Sentence] = \
            root.sentence_list.sentences.all().order_by("?")
        sentences = [s for s in search_space if s.contains_word(root.word)]
        return sentences


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
    
    def _setup_for_first_play(
            user: settings.AUTH_USER_MODEL,
            sentence_list: SentenceList
    ):
        """Set things up if user is playing a list for the first time."""

        user_profile = UserProfile.objects.get(owner=user)
        if user_profile.played_lists.contains(sentence_list):
            return
        sentence_list.prepare_word_cards(owner=True, in_bulk=True)

    def _get_sentence_list_from_gql_id(id) -> SentenceList:
        """Return the SentenceList given GraphQL's global ID."""

        normal_id = int(from_global_id(id)[1])
        return SentenceList.objects.get(id=normal_id)

    def _get_word_cards_ordered_by_reviewableness(
            owner: settings.AUTH_USER_MODEL,
            sentence_list: SentenceList
    ) -> Iterable[WordCard]:
        """Return an ordered list of word cards for the given list and owner.
        
        The word cards are ordered based on the need to review them.
        """

        with_reviewableness_score = WordCard.objects.annotate(
            reviewableness_score=(
                date.today()
                - F("last_review_date")
                - F("inter_repetition_interval")
            )
        )

        return with_reviewableness_score.filter(
            sentence_list=sentence_list, owner=owner
        ).order_by("-reviewableness_score")

    def resolve_word_cards(root, info, sentence_list_id, **kwargs):
        if info.context.user.is_anonymous:
            raise Exception("Not authenticated")
        
        sentence_list = Query._get_sentence_list_from_gql_id(sentence_list_id)
        Query._setup_for_first_play(info.context.user, sentence_list)
        return Query._get_word_cards_ordered_by_reviewableness(
            info.context.user, sentence_list)


class UpdateProficiency(relay.ClientIDMutation):
    class Input:
        word_card_id = graphene.ID()
        score = graphene.Int(required=True)

    def _get_word_card_from_gql_id(id: str) -> WordCard:
        """Return the WordCard given it's GraphQL global ID."""

        normal_id = int(from_global_id(id)[1])
        return WordCard.objects.get(id=normal_id)

    @classmethod
    def mutate_and_get_payload(cls, root, info, word_card_id, score, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        if score < 0 or score > 5:
            raise Exception("Score must be between 0 and 5")

        word_card = UpdateProficiency._get_word_card_from_gql_id(word_card_id)
        if word_card.owner != info.context.user:
            raise Exception("You are not the owner of this card")

        word_card.update_proficiency(score)
        return UpdateProficiency()


class Mutation(graphene.ObjectType):
    update_proficiency = UpdateProficiency.Field()
