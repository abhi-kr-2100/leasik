from rest_framework import serializers

from leasikApp.models import Proficiency, Sentence, SentenceList, SentenceNote


class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = ['id', 'text', 'translation']


class SentenceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceList
        fields = ['id', 'name', 'slug', 'description', 'sentences']
        read_only_fields = ['slug']


class SentenceNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceNote
        fields = ['id', 'sentence', 'note']


class ProficiencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Proficiency
        fields = ['id', 'sentence', 'proficiency']
