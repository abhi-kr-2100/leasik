from rest_framework.serializers import HyperlinkedModelSerializer

from leasikApp.models import Card, Sentence, SentenceBookmark, SentenceList


class CardSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Card
        fields = [
            'repetition_number', 'easiness_factor', 'inter_repetition_interval',
            'last_review_date', 'note', 'owner', 'sentence',
            'hidden_word_position'
        ]


class SentenceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            'text', 'translation', 'text_language', 'translation_language',
        ]


class SentenceBookmarkSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = SentenceBookmark
        fields = ['owner', 'sentence_list', 'sentences']


class SentenceListSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = SentenceList
        fields = ['name', 'slug', 'description', 'is_public', 'sentences']
