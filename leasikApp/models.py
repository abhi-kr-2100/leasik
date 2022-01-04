from django.db import models


class Sentence(models.Model):
    sentence_text = models.TextField(primary_key=True)

    def __str__(self) -> str:
        return self.sentence_text


class Word(models.Model):
    # a provisional list of all languages available
    language_choices = [
        ('en', 'English'),
        ('tr', 'Türkçe'),
    ]

    word_text = models.CharField(max_length=50)
    language = models.CharField(max_length=2, choices=language_choices)

    # this line has been temporarily commented out to allow Django to create
    # proper migrations for the upcoming Sentence model. In the new Sentence
    # model, the primary key of the model will change, as a result, this
    # foreign relationship will become invalid. It'll be restored once the new
    # Sentence model is ready.
    # sentences = models.ManyToManyField(Sentence)

    def __str__(self) -> str:
        return self.word_text

    class Meta:
        unique_together = ('word_text', 'language')
