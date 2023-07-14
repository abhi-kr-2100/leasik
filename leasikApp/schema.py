import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django import DjangoObjectType

from .models import Sentence, Book, Word, WordScore


class WordType(DjangoObjectType):
    class Meta:
        model = Word
        interfaces = (relay.Node,)


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


class BookConnection(relay.Connection):
    class Meta:
        node = BookType


class Query(graphene.ObjectType):
    books = relay.ConnectionField(BookConnection)
    sentences = relay.ConnectionField(
        SentenceConnection, book_id=graphene.ID(required=True)
    )

    def resolve_books(root, info, **kwargs):
        return Book.objects.all()

    def resolve_sentences(root, info, book_id, **kwargs):
        if not info.context.user.is_authenticated:
            raise PermissionError("Not authenticated.")

        book = Query._get_book_from_gql_id(book_id)
        return book.get_sentences_sorted_by_proficiency_score()

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
        return UpdateProficiency()


class Mutation(graphene.ObjectType):
    update_proficiency = UpdateProficiency.Field()
