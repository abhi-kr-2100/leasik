from rest_framework import serializers

from leasikApp.models import Proficiency, Sentence, SentenceList, SentenceNote


class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = ['text', 'translation']


class SentenceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceList
        fields = ['name', 'slug', 'description', 'sentences']


class SentenceNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceNote
        fields = ['sentence', 'user']


class ProficiencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Proficiency
        fields = ['user', 'sentence']
