from __future__ import annotations
from typing import Any
from datetime import date, timedelta

from django.db import models
from django.db.models.signals import post_save
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.dispatch import receiver

from .helpers import sm2


class Sentence(models.Model):
    """A sentence with a text and translation."""

    text = models.TextField()
    translation = models.TextField()

    class Meta:
        unique_together = ("text", "translation")

    def __str__(self) -> str:
        return f"{self.text} ({self.translation})"


class Card(models.Model):
    """A card relates a sentence with a hidden word position.

    The hidden word position determines which word in the sentence the user
    will be tested on. If it's -1, a random word is selected each time.

    Card is used to implement the SM-2 algorithm. See
    https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm.
    """

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

    # TODO: Remove this.
    note = models.TextField(blank=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)

    # -1 means a random word will be selected each time
    hidden_word_position = models.SmallIntegerField(default=-1)

    class Meta:
        unique_together = ("owner", "sentence", "hidden_word_position")

    def __str__(self) -> str:
        return (
            f"<{self.sentence.text}> of {self.owner.username}. "
            f"HWP: {self.hidden_word_position}"
        )

    def is_up_for_review(self) -> bool:
        """Return True if Card needs to be reviewed, False otherwise."""
        days_passed = date.today() - self.last_review_date
        return days_passed >= self.inter_repetition_interval

    def update_proficiency(self, score: int) -> None:
        """Update the Card's proficiency based on the given score."""

        if score < 0 or score > 5:
            raise ValueError("Score must be between 0 and 5")

        n, ef, i = sm2(
            score,
            self.repetition_number,
            self.easiness_factor,
            self.inter_repetition_interval,
        )

        self.repetition_number = n
        self.easiness_factor = ef
        self.inter_repetition_interval = i
        self.last_review_date = date.today()

        self.save()


class SentenceList(models.Model):
    """A list of sentences owned by a user."""

    name = models.CharField(max_length=100)
    # TODO: Remove this.
    slug = models.SlugField(max_length=100, unique=True)

    description = models.TextField(blank=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)

    sentences = models.ManyToManyField(Sentence, blank=True)

    def __str__(self) -> str:
        return self.name


# TODO: Work out a better design for this.
class Bookmark(models.Model):
    """A bookmark relation between a SentenceList and User, and Cards."""

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence_list = models.ForeignKey(SentenceList, on_delete=models.CASCADE)
    cards = models.ManyToManyField(Card, blank=True)

    class Meta:
        unique_together = ("owner", "sentence_list")

    def __str__(self) -> str:
        return f"Of {self.owner} for {self.sentence_list}."


class UserProfile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.owner.username

    @staticmethod
    @receiver(post_save, sender=User)
    def create_user_profile(
        sender: UserProfile, instance: User, created: bool, **kwargs: Any
    ) -> None:
        if created:
            UserProfile.objects.create(owner=instance)
