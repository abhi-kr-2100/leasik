from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from leasikApp.models import Card, Sentence, Bookmark, SentenceList
from leasikREST.paginations import NestedPagination


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id"]


class SentenceSerializer(ModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            "id",
            "text",
            "translation",
            "text_language",
            "translation_language",
        ]


class NestedSentenceSerializer(ModelSerializer):
    class Meta:
        model = Sentence
        fields = ["id"]


class CardSerializer(ModelSerializer):
    owner = UserSerializer()
    sentence = SentenceSerializer()

    class Meta:
        model = Card
        fields = [
            "id",
            "repetition_number",
            "easiness_factor",
            "inter_repetition_interval",
            "last_review_date",
            "note",
            "owner",
            "sentence",
            "hidden_word_position",
        ]


class NestedCardSerializer(ModelSerializer):
    class Meta:
        model = Card
        fields = ["id"]


class SentenceListSerializer(ModelSerializer):
    owner = UserSerializer()
    sentences = SerializerMethodField("paginated_sentences")

    class Meta:
        model = SentenceList
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "owner",
            "is_public",
            "sentences",
        ]

    def paginated_sentences(self, obj: SentenceList):
        sentences = obj.sentences.all()
        paginator = NestedPagination()
        page = paginator.paginate_queryset(sentences, self.context["request"])
        serializer = NestedSentenceSerializer(
            page, many=True, context={"request": self.context["request"]}
        )

        return serializer.data


class NestedSentenceListSerializer(ModelSerializer):
    class Meta:
        model = SentenceList
        fields = ["id"]


class BookmarkSerializer(ModelSerializer):
    owner = UserSerializer()
    sentence_list = NestedSentenceListSerializer()
    cards = CardSerializer(many=True)

    class Meta:
        model = Bookmark
        fields = ["id", "owner", "sentence_list", "cards"]
