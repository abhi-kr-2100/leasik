from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from leasikApp.models import Card, Sentence, SentenceBookmark, SentenceList
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
    sentence = NestedSentenceSerializer()

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


class SentenceBookmarkSerializer(ModelSerializer):
    owner = UserSerializer()
    sentence_list = NestedSentenceListSerializer()
    sentences = SerializerMethodField("paginated_sentences")

    class Meta:
        model = SentenceBookmark
        fields = ["id", "owner", "sentence_list", "sentences"]

    def paginated_sentences(self, obj: SentenceBookmark):
        sentences = obj.sentences.all()
        paginator = NestedPagination()
        page = paginator.paginate_queryset(sentences, self.context["request"])
        serializer = NestedSentenceSerializer(
            page, many=True, context={"request": self.context["request"]}
        )

        return serializer.data
