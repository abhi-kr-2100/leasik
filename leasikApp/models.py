from __future__ import annotations
from typing import Any
from datetime import date, timedelta

from django.db import models
from django.db.models.signals import post_save
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver


class Sentence(models.Model):
    """A sentence with a text and translation."""

    text = models.TextField()
    translation = models.TextField()

    text_language = models.CharField(
        max_length=2, validators=[MinValueValidator(2)], blank=True
    )
    translation_language = models.CharField(
        max_length=2, validators=[MinValueValidator(2)], blank=True
    )

    class Meta:
        unique_together = ("text", "translation")

    def __str__(self) -> str:
        return f"{self.text} ({self.translation})"


class Card(models.Model):
    """A card similar to the ones in flashcard programs.

    Card is used to implement the SM-2 algorithm. See
    https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm."""

    repetition_number = models.IntegerField(
        default=0, validators=[MinValueValidator(0)]
    )
    easiness_factor = models.FloatField(default=2.5)

    # The default value for inter-repetition interval is not mentioned on the
    # Wikipedia page for SM-2. A default of 0 has been chosen so that users can
    # review newly added cards. It is always in whole days.
    inter_repetition_interval = models.DurationField(
        default=timedelta(days=0),
        verbose_name="inter-repetition interval",
        validators=[MinValueValidator(0)],
    )

    last_review_date = models.DateField(auto_now_add=True)

    note = models.TextField(blank=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("owner", "sentence")

    def __str__(self) -> str:
        return f"Card <{self.sentence.text}> of {self.owner.username}."

    def is_up_for_review(self) -> bool:
        """Does the card needs to be reviewed?"""

        days_passed = self.last_review_date - date.today()
        return days_passed >= self.inter_repetition_interval


class SentenceList(models.Model):
    """A list of sentences owned by a user."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    description = models.TextField(blank=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)

    sentences = models.ManyToManyField(Sentence, blank=True)

    def __str__(self) -> str:
        return self.name


class SentenceBookmark(models.Model):
    """A bookmark relation between a SentenceList and User, and Sentences."""

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence_list = models.ForeignKey(SentenceList, on_delete=models.CASCADE)
    sentences = models.ManyToManyField(Sentence, blank=True)

    class Meta:
        unique_together = ("owner", "sentence_list")


class UserProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.owner.username

    @receiver(post_save, sender=User)
    def create_user_profile(
        sender: UserProfile, instance: User, created: bool, **kwargs: Any
    ) -> None:
        if created:
            UserProfile.objects.create(owner=instance)
