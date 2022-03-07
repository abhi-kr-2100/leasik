from rest_framework.serializers import ModelSerializer, CharField, BooleanField

from leasikApp.models import Card, Sentence, Bookmark, SentenceList


class SentenceSerializer(ModelSerializer):
    id = CharField()  # id may be too big for JavaScript's number type

    class Meta:
        model = Sentence
        fields = [
            "id",
            "text",
            "translation",
        ]


class CardSerializer(ModelSerializer):
    id = CharField()  # id may be too big for JavaScript's number type
    sentence = SentenceSerializer()

    class Meta:
        model = Card
        fields = [
            "id",
            "note",
            "sentence",
            "hidden_word_position",
        ]


class AugmentedCardSerializer(ModelSerializer):
    """Serializer for the Card object, with the extra field is_bookmarked."""

    id = CharField()  # id may be too big for JavaScript's number type
    sentence = SentenceSerializer()
    is_bookmarked = BooleanField()

    class Meta:
        model = Card
        fields = [
            "id",
            "note",
            "sentence",
            "hidden_word_position",
        ]


class SentenceListSerializer(ModelSerializer):
    id = CharField()  # id may be too big for JavaScript's number type

    class Meta:
        model = SentenceList
        fields = [
            "id",
            "name",
            "description",
        ]


class BookmarkSerializer(ModelSerializer):
    id = CharField()  # id may be too big for JavaScript's number type
    sentence_list = SentenceListSerializer()
    cards = CardSerializer(many=True)

    class Meta:
        model = Bookmark
        fields = ["id"]
