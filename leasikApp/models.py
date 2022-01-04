from django.db import models


class Sentence(models.Model):
    sentence_text = models.TextField(primary_key=True)


class Word(models.Model):
    # a provisional list of all languages available
    language_choices = [
        ('en', 'English'),
        ('tr', 'Türkçe'),
    ]

    word_text = models.CharField(max_length=50)
    language = models.CharField(choices=language_choices)

    sentences = models.ManyToManyField(Sentence)

    class Meta:
        unique_together = ('word_text', 'language')
