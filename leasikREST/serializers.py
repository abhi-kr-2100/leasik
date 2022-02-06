from django.contrib.auth.models import User
from rest_framework.serializers import HyperlinkedModelSerializer

from leasikApp.models import Card, Sentence, SentenceBookmark, SentenceList


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id']


class SentenceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            'text', 'translation', 'text_language', 'translation_language',
        ]


class CardSerializer(HyperlinkedModelSerializer):
    owner = UserSerializer()
    sentence = SentenceSerializer()
    
    class Meta:
        model = Card
        fields = [
            'repetition_number', 'easiness_factor', 'inter_repetition_interval',
            'last_review_date', 'note', 'owner', 'sentence',
            'hidden_word_position'
        ]


class SentenceListSerializer(HyperlinkedModelSerializer):
    owner = UserSerializer()
    sentences = SentenceSerializer(many=True)

    class Meta:
        model = SentenceList
        fields = ['name', 'slug', 'description', 'owner', 'is_public', 'sentences']


class SentenceBookmarkSerializer(HyperlinkedModelSerializer):
    owner = UserSerializer()
    sentence_list = SentenceListSerializer()
    sentences = SentenceSerializer(many=True)

    class Meta:
        model = SentenceBookmark
        fields = ['owner', 'sentence_list', 'sentences']
