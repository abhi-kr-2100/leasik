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


class SentenceListType(DjangoObjectType):
    class Meta:
        model = SentenceList
        interfaces = (relay.Node,)


class CardType(DjangoObjectType):
    class Meta:
        model = Card
        interfaces = (relay.Node,)
        fields = ("owner", "sentence", "hidden_word_position", "is_bookmarked")

    reviewable = graphene.Boolean()
    hidden_word_positions = graphene.List(graphene.Int)

    def resolve_reviewable(root, info):
        return root.is_up_for_review()

    def resolve_hidden_word_positions(root, info):
        sentence = root.sentence
        cards = sentence.card_set.filter(owner=root.owner)
        hidden_word_positions = [
            c.hidden_word_position
            for c in cards
            if c.hidden_word_position != -1
        ]
        return hidden_word_positions


class SentenceConnection(relay.Connection):
    class Meta:
        node = SentenceType


class SentenceListConnection(relay.Connection):
    class Meta:
        node = SentenceListType


class CardConnection(relay.Connection):
    class Meta:
        node = CardType


class AddCard(relay.ClientIDMutation):
    class Input:
        sentence_id = graphene.ID()
        hidden_word_position = graphene.Int(required=True)

    @classmethod
    def mutate_and_get_payload(
        cls, root, info, sentence_id, hidden_word_position, **kwargs
    ):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        sentence_id_int = int(from_global_id(sentence_id)[1])
        sentence: Sentence = Sentence.objects.get(id=sentence_id_int)

        sentence.card_set.get_or_create(
            owner=info.context.user, hidden_word_position=hidden_word_position
        )

        return AddCard()


class RemoveCard(relay.ClientIDMutation):
    class Input:
        sentence_id = graphene.ID()
        hidden_word_position = graphene.Int(required=True)

    @classmethod
    def mutate_and_get_payload(
        cls, root, info, sentence_id, hidden_word_position, **kwargs
    ):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        sentence_id_int = int(from_global_id(sentence_id)[1])
        sentence: Sentence = Sentence.objects.get(id=sentence_id_int)

        sentence.card_set.filter(
            owner=info.context.user, hidden_word_position=hidden_word_position
        ).delete()

        return RemoveCard()


class AddBookmark(relay.ClientIDMutation):
    class Input:
        card_id = graphene.ID()

    card = graphene.Field(CardType)

    @classmethod
    def mutate_and_get_payload(cls, root, info, card_id, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        card_id_int = int(from_global_id(card_id)[1])
        card: Card = Card.objects.get(id=card_id_int)

        card.is_bookmarked = True
        card.save()

        return AddBookmark(card=card)


class RemoveBookmark(relay.ClientIDMutation):
    class Input:
        card_id = graphene.ID()

    card = graphene.Field(CardType)

    @classmethod
    def mutate_and_get_payload(cls, root, info, card_id, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        card_id_int = int(from_global_id(card_id)[1])
        card: Card = Card.objects.get(id=card_id_int)

        card.is_bookmarked = False
        card.save()

        return RemoveBookmark(card=card)


class UpdateProficency(relay.ClientIDMutation):
    class Input:
        card_id = graphene.ID()
        score = graphene.Int(required=True)

    card = graphene.Field(CardType)

    @classmethod
    def mutate_and_get_payload(cls, root, info, card_id, score, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Not authenticated")

        if score < 0 or score > 5:
            raise Exception("Score must be between 0 and 5")

        card_id_int = int(from_global_id(card_id)[1])
        card: Card = Card.objects.get(id=card_id_int)

        if card.owner != info.context.user:
            raise Exception("You are not the owner of this card")

        card.update_proficiency(score)

        return UpdateProficency(card=card)


class Query(graphene.ObjectType):
    sentences = relay.ConnectionField(SentenceConnection)
    cards = relay.ConnectionField(
        CardConnection,
        reviewable=graphene.Boolean(required=False),
        bookmarked=graphene.Boolean(required=False),
        sentence_list_id=graphene.ID(required=False),
        randomize=graphene.Boolean(required=False, default_value=False),
    )
    sentence_lists = relay.ConnectionField(SentenceListConnection)

    def resolve_sentences(root, info, **kwargs):
        return Sentence.objects.all()

    def resolve_cards(
        root,
        info,
        randomize,
        reviewable=None,
        bookmarked=None,
        sentence_list_id=None,
        **kwargs
    ):
        if info.context.user.is_anonymous:
            return Card.objects.none()

        # create some cards in case some sentences don't have cards yet
        for s in Sentence.objects.all().order_by("?")[:100]:
            if s.card_set.filter(owner=info.context.user).count() == 0:
                Card.objects.create(
                    owner=info.context.user,
                    sentence=s,
                    hidden_word_position=-1,
                )

        cards = Card.objects.filter(owner=info.context.user)
        if reviewable is not None:
            compatible_ids = [
                card.id
                for card in cards
                if card.is_up_for_review() == reviewable
            ]
            cards = cards.filter(id__in=compatible_ids)

        if bookmarked is not None:
            compatible_ids = [
                card.id for card in cards if card.is_bookmarked == bookmarked
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


class Mutation(graphene.ObjectType):
    update_proficiency = UpdateProficency.Field()
    add_card = AddCard.Field()
    remove_card = RemoveCard.Field()
    add_bookmark = AddBookmark.Field()
    remove_bookmark = RemoveBookmark.Field()
