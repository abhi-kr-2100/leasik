from enum import unique
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

from .helpers import get_sentence_text


class Sentence(models.Model):
    sentence_id = models.IntegerField("Tatoeba sentence ID", primary_key=True)

    def get_text(self):
        return get_sentence_text(self.sentence_id)

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


class List(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    
    words = models.ManyToManyField(Word)

    def __str__(self) -> str:
        return self.name

    class Meta:
        unique_together = ('slug', 'owner')


class Proficiency(models.Model):
    """How proficient is a user with a word?"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    word = models.OneToOneField(Word, on_delete=models.CASCADE)

    proficiency = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self) -> str:
        return f'{self.user.id}: {self.word.word_text} - {self.proficiency}%'

    class Meta:
        unique_together = ('user', 'word')
