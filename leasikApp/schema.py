from django.db.models import Q

import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django import DjangoObjectType

from .models import Sentence, Book, Word, WordScore, Tag
from .helpers import is_answer_correct


class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        interfaces = (relay.Node,)


class TagConnection(relay.Connection):
    class Meta:
        node = TagType


class WordType(DjangoObjectType):
    class Meta:
        model = Word
        interfaces = (relay.Node,)

    proficiency_score = graphene.Float()

    def resolve_proficiency_score(root: Word, info, **kwargs) -> float:
        if not info.context.user.is_authenticated:
            raise PermissionError("Not authenticated.")

        word_score = WordScore.objects.get_or_create(
            word=root, owner=info.context.user
        )[0]
        return word_score.get_proficiency_score()


class WordConnection(relay.Connection):
    class Meta:
        node = WordType


class SentenceType(DjangoObjectType):
    class Meta:
        model = Sentence
        interfaces = (relay.Node,)


class SentenceConnection(relay.Connection):
    class Meta:
        node = SentenceType


class BookType(DjangoObjectType):
    class Meta:
        model = Book
        interfaces = (relay.Node,)

    tags = graphene.ConnectionField(TagConnection)

    def resolve_tags(root: Book, info, **kwargs):
        # Not passing this through a set would cause duplicate tags since
        # many sentences may have the same tag.
        tags = list({t for s in root.sentences.all() for t in s.tags.all()})
        return tags


class BookConnection(relay.Connection):
    class Meta:
        node = BookType


class Query(graphene.ObjectType):
    books = relay.ConnectionField(BookConnection)
    sentences = relay.ConnectionField(
        SentenceConnection,
        book_id=graphene.ID(required=True),
        tags=graphene.List(graphene.String),
        includeUntagged=graphene.Boolean(),
    )

    def resolve_books(root, info, **kwargs) -> BookConnection:
        return Book.objects.all()

    def resolve_sentences(
        root, info, book_id, tags=None, includeUntagged=True, **kwargs
    ) -> SentenceConnection:
        if not info.context.user.is_authenticated:
            raise PermissionError("Not authenticated.")

        book = Query._get_book_from_gql_id(book_id)

        filter = None
        if tags is None and not includeUntagged:
            filter = ~Q(tags=None)
        elif tags is not None and includeUntagged:
            filter = Q(tags__label__in=tags) | Q(tags=None)
        elif tags is not None and not includeUntagged:
            filter = Q(tags__label__in=tags) & ~Q(tags=None)

        if filter is None:
            return book.get_sentences_sorted_by_proficiency_score(
                owner=info.context.user
            )
        return book.get_sentences_sorted_by_proficiency_score(
            info.context.user, filter
        )

    def _get_book_from_gql_id(id: str) -> Book:
        normal_id = int(from_global_id(id)[1])
        return Book.objects.get(id=normal_id)


class UpdateProficiency(relay.ClientIDMutation):
    class Input:
        word_id = graphene.ID()
        score = graphene.Int(required=True)

    def _get_word_from_gql_id(id: str) -> Word:
        normal_id = int(from_global_id(id)[1])
        return Word.objects.get(id=normal_id)

    @classmethod
    def mutate_and_get_payload(cls, root, info, word_id, score, **kwargs):
        if not info.context.user.is_authenticated:
            raise PermissionError("Not authenticated.")

        word = UpdateProficiency._get_word_from_gql_id(word_id)
        word_score = WordScore.objects.get_or_create(
            word=word, owner=info.context.user
        )[0]

        word_score.update_word_score(score)

        if is_answer_correct(score):
            # We'll also slightly increase the score of all WordScores that
            # have this word. Progress on a word in one context is also a
            # little progress in every other context.
            word_scores = WordScore.objects.filter(word__word=word.word)
            for ws in word_scores:
                ws.improve_word_score_slightly()

        return UpdateProficiency()


class Mutation(graphene.ObjectType):
    update_proficiency = UpdateProficiency.Field()
