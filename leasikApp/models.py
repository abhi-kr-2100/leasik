from django.db import models


class Sentence(models.Model):
    sentence_id = models.IntegerField("Tatoeba sentence ID", primary_key=True)

    def __str__(self) -> str:
        return f'ID: {self.sentence_id}'


class Word(models.Model):
    # a provisional list of all languages available
    language_choices = [
        ('en', 'English'),
        ('tr', 'Türkçe'),
    ]

    word_text = models.CharField(max_length=50)
    language = models.CharField(max_length=2, choices=language_choices)

    sentences = models.ManyToManyField(Sentence)

    def __str__(self) -> str:
        return self.word_text

    class Meta:
        unique_together = ('word_text', 'language')
