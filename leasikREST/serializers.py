from rest_framework.serializers import ModelSerializer

from leasikApp.models import Card, Sentence, Bookmark, SentenceList


class SentenceSerializer(ModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            "id",
            "text",
            "translation",
        ]


class CardSerializer(ModelSerializer):
    sentence = SentenceSerializer()

    class Meta:
        model = Card
        fields = [
            "id",
            "note",
            "sentence",
            "hidden_word_position",
        ]


class SentenceListSerializer(ModelSerializer):
    class Meta:
        model = SentenceList
        fields = [
            "id",
            "name",
            "description",
        ]


class BookmarkSerializer(ModelSerializer):
    sentence_list = SentenceListSerializer()
    cards = CardSerializer(many=True)

    class Meta:
        model = Bookmark
        fields = ["id"]
