from rest_framework.serializers import HyperlinkedModelSerializer

from leasikApp.models import Card, Sentence, SentenceBookmark, SentenceList


class SentenceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            'text', 'translation', 'text_language', 'translation_language',
        ]


class CardSerializer(HyperlinkedModelSerializer):
    sentence = SentenceSerializer()
    
    class Meta:
        model = Card
        fields = [
            'repetition_number', 'easiness_factor', 'inter_repetition_interval',
            'last_review_date', 'note', 'sentence',
            'hidden_word_position'
        ]


class SentenceListSerializer(HyperlinkedModelSerializer):
    sentences = SentenceSerializer(many=True)

    class Meta:
        model = SentenceList
        fields = ['name', 'slug', 'description', 'is_public', 'sentences']


class SentenceBookmarkSerializer(HyperlinkedModelSerializer):
    sentence_list = SentenceListSerializer()
    sentences = SentenceSerializer(many=True)

    class Meta:
        model = SentenceBookmark
        fields = ['sentence_list', 'sentences']
