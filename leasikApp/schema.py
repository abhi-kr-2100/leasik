from string import digits, punctuation, whitespace

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

    def resolve_sentences(root, info, **kwargs):
        # Try to return only those sentences which contain the whole word.
        #
        # When word is "abc", matches: "abc.", "'abc'", "I'm abc.", etc.
        # Shouldn't match: "abcd", "a'bc", etc.
        #
        # A few heuristics:
        # 1. if word is followed by punctuation or digit, the word must be
        #   the last word, or be followed by space. This disallows "abc..d"
        # 2. if a word starts with a punctuation or digit, before the very
        #   first digit or punctuation, there must either be nothing or one
        #   or more spaces. This disqualifies "İstanbul'abc".

        # doesn't start or end with punctuations or digits
        regex00 = f"(^|[{whitespace}]+){root.word}($|[{whitespace}]+)"

        # doesn't start with a punctuation or digit but ends with one
        regex01 = f"(^|[{whitespace}]+){root.word}[{punctuation}{digits}]+($|[{whitespace}]+)"

        # starts with a punctuation or digit but doesn't end with one
        regex10 = f"(^|[{whitespace}]+)[{punctuation}{digits}]+{root.word}($|[{whitespace}]+)"

        # starts with a punctuation or digit and also ends with one
        regex11 = f"(^|[{whitespace}]+)[{punctuation}{digits}]+{root.word}[{punctuation}{digits}]+($|[{whitespace}]+)"

        final_regex = f"(({regex00})|({regex01})|({regex10})|({regex11}))"

        return root.sentence_list.sentences.filter(
            text__iregex=final_regex
        ).order_by("?")


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
            sl.prepare_word_cards(info.context.user, in_bulk=True)
            user_profile.played_lists.add(sl)

        return (
            WordCard.objects.filter(sentence_list=sl, owner=info.context.user)
            # TODO: Replace with a proper check on whether the card is up for
            # review
            .order_by(
                "inter_repetition_interval",
                "easiness_factor",
                "-last_review_date",
                "?",
            )
        )


class UpdateProficiency(relay.ClientIDMutation):
    class Input:
        word_card_id = graphene.ID()
        score = graphene.Int(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, word_card_id, score, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        if score < 0 or score > 5:
            raise Exception("Score must be between 0 and 5")

        int_id = int(from_global_id(word_card_id)[1])
        word_card = WordCard.objects.get(id=int_id)

        if word_card.owner != info.context.user:
            raise Exception("You are not the owner of this card")

        word_card.update_proficiency(score)

        return UpdateProficiency()


class Mutation(graphene.ObjectType):
    update_proficiency = UpdateProficiency.Field()
