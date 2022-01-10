from __future__ import annotations

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver

from allauth.account.signals import user_signed_up


# a provisional list of all languages available
language_choices = [
    ('en', 'English'),
    ('tr', 'Türkçe'),
]


class SelfContainedSentence(models.Model):
    sentence_id = models.AutoField(primary_key=True)
    text = models.TextField()
    english_translation = models.TextField()

    class Meta:
        unique_together = ('text', 'english_translation')

    def get_text(self):
        return self.text

    def get_english_translation(self):
        return self.english_translation

    def __str__(self) -> str:
        return f'{self.text} ({self.english_translation})'


class SentenceList(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    sentences = models.ManyToManyField(SelfContainedSentence, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        unique_together = ('slug', 'owner')


class SentenceProficiency(models.Model):
    """How proficient is a user with a given sentence?"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey(
        SelfContainedSentence, on_delete=models.CASCADE)

    proficiency = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self) -> str:
        return f'{self.user.id}: {self.sentence.text} - {self.proficiency}%'

    def __lt__(self, other: SentenceProficiency) -> bool:
        return self.proficiency < other.proficiency

    class Meta:
        unique_together = ('user', 'sentence')


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
