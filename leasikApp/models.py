from __future__ import annotations
from typing import Iterable
from datetime import date, timedelta
from string import digits, punctuation, whitespace

from icu import UnicodeString, Locale

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator
from django.conf import settings

from .helpers import get_overall_proficiency_score, sm2


class Tag(models.Model):
    label = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.label


class Sentence(models.Model):
    """A sentence with a text and translation.

    Text is in the language the user is learning, and translation is in the
    language that the user already understands.
    """

    text = models.CharField(max_length=255)
    translation = models.CharField(max_length=255)

    # ISO 639-1 language code: https://en.wikipedia.org/wiki/ISO_639-1
    text_language = models.CharField(max_length=2, blank=True)
    # Similar to ISO 639, but may contain additional information, for example,
    # regional variant: en-US, en-GB, en-IN, etc.
    text_locale = models.CharField(max_length=50, blank=True)

    tags = models.ManyToManyField(to=Tag, blank=True)

    class Meta:
        unique_together = ("text", "translation")

    def get_associated_word_models(self):
        return Word.objects.filter(sentence=self)

    def get_associated_word_score_models(
        self, owner: settings.AUTH_USER_MODEL
    ):
        words = self.get_associated_word_models()
        word_scores = [
            WordScore.objects.get_or_create(word=w, owner=owner)[0]
            for w in words
        ]

        return word_scores

    def get_proficiency_score(self, owner: settings.AUTH_USER_MODEL):
        """Proficiency of owner in using words in this sentence's context."""
        word_scores = self.get_associated_word_score_models(owner)
        return get_overall_proficiency_score(word_scores)

    def get_words(self):
        """Return the set of all words in the text of this sentence."""
        words = self.text.split()
        stripped_words = [
            word.strip(punctuation + whitespace + digits) for word in words
        ]

        locale = Locale(self.text_locale)
        localized = [
            UnicodeString(word).toLower(locale) for word in stripped_words
        ]
        return set(str(s) for s in localized)

    def __str__(self) -> str:
        return f"{self.text} ({self.translation})"


@receiver(post_save, sender=Sentence)
def create_word_models(sender, instance: Sentence, *args, **kwargs):
    words = instance.get_words()
    for word in words:
        Word.objects.create(word=word, sentence=instance)


class Book(models.Model):
    """A collection of Sentences."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=2500, blank=True)

    sentences = models.ManyToManyField(to=Sentence, blank=True)

    def get_sentences_sorted_by_proficiency_score(
        self, owner: settings.AUTH_USER_MODEL, **filter_conditions
    ) -> Iterable[Sentence]:
        sentences = list(self.sentences.filter(**filter_conditions))
        return sorted(
            sentences,
            key=lambda s: s.get_proficiency_score(owner=owner),
            reverse=True,
        )

    def __str__(self) -> str:
        return self.name


class Word(models.Model):
    word = models.CharField(max_length=50)

    # the sentence to whose text this word belongs
    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("word", "sentence")

    def __str__(self):
        return f"<{self.word}> of {self.sentence}"


class WordScore(models.Model):
    """The proficiency score of a user on a particular word.

    The proficiency score is calculated using the SM-2 algorithm.
    See: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
    """

    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("word", "owner")

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
        validators=[MinValueValidator(timedelta(days=0))],
    )

    last_review_date = models.DateField(auto_now_add=True)

    def get_proficiency_score(self):
        return (
            date.today()
            - self.last_review_date
            - self.inter_repetition_interval
        ).days

    def update_word_score(self, score: int):
        """Update the SM-2 parameters based on the given score."""

        if score not in range(0, 5 + 1):
            raise ValueError("Score must be an integer from 0 to 5.")

        repetition_number, easiness_factor, inter_repetition_interval = sm2(
            score,
            self.repetition_number,
            self.easiness_factor,
            self.inter_repetition_interval,
        )

        self.repetition_number = repetition_number
        self.easiness_factor = easiness_factor
        self.inter_repetition_interval = inter_repetition_interval
        self.last_review_date = date.today()

        self.save()

    def __str__(self) -> str:
        return f"{self.word} of {self.owner.username}"
