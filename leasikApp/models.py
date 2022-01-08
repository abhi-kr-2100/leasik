from __future__ import annotations

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver

from allauth.account.signals import user_signed_up

from .helpers import get_sentence_text, get_english_translation


# a provisional list of all languages available
language_choices = [
    ('en', 'English'),
    ('tr', 'Türkçe'),
]


class SelfContainedSentence(models.Model):
    sentence_id = models.AutoField(primary_key=True)
    text = models.TextField()
    english_translation = models.TextField()

    def get_text(self):
        return self.text

    def get_english_translation(self):
        return self.english_translation

    def __str__(self) -> str:
        return f'{self.text} ({self.english_translation})'


class Sentence(models.Model):
    sentence_id = models.IntegerField("Tatoeba sentence ID", primary_key=True)
    text = models.TextField(null=True, editable=False)
    english_translation = models.TextField(null=True, editable=False)

    def get_text(self):
        if not self.text:
            self.text = get_sentence_text(self.sentence_id)
            self.save(update_fields=['text'])

        return self.text

    def get_english_translation(self):
        if not self.english_translation:
            self.english_translation = get_english_translation(self.sentence_id)
            self.save(update_fields=['english_translation'])

        return self.english_translation

    def __str__(self) -> str:
        return f'ID: {self.sentence_id}'


class Word(models.Model):
    word_text = models.CharField(max_length=50)
    language = models.CharField(max_length=2, choices=language_choices)

    sentences = models.ManyToManyField(SelfContainedSentence)

    def __str__(self) -> str:
        return self.word_text

    class Meta:
        unique_together = ('word_text', 'language')


class List(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    
    words = models.ManyToManyField(Word, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        unique_together = ('slug', 'owner')


class Proficiency(models.Model):
    """How proficient is a user with a word?"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)

    proficiency = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self) -> str:
        return f'{self.user.id}: {self.word.word_text} - {self.proficiency}%'

    def __lt__(self, other: Proficiency) -> bool:
        return self.proficiency < other.proficiency

    class Meta:
        unique_together = ('user', 'word')


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    current_studying_language = models.CharField(max_length=2,
        choices=language_choices, default=language_choices[0][0])
    questions_per_page = models.IntegerField(
        validators=[MinValueValidator(5), MaxValueValidator(50)], default=25)

    def __str__(self) -> str:
        return self.user.username

    @receiver(user_signed_up)
    def create_user_profile(sender, **kwargs):
        user = User.objects.get(username=kwargs['user'].username)
        UserProfile.objects.create(user=user)
