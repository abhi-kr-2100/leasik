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

from .helpers import sm2


class Tag(models.Model):
    """A tag made up of a short string."""

    label = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return f"{self.label}"


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

    tags = models.ManyToManyField(Tag)

    class Meta:
        unique_together = ("text", "translation")

    def get_words(self):
        """Return the set of all words in the text of this sentence."""

        words = self.text.split()
        stripped_words = [word.strip(punctuation + whitespace + digits) for word in words]

        locale = Locale(self.text_lo)
        localized = [UnicodeString(word).toLower(locale) for word in stripped_words]
        return set(localized)
    
    def __str__(self) -> str:
        return f"{self.text} ({self.translation})"


class SentenceList(models.Model):
    """A list of sentences owned by a user."""

    name = models.CharField(max_length=100)
    description = models.TextField(max_length=2500, blank=True)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    is_public = models.BooleanField(default=True)

    sentences = models.ManyToManyField(Sentence, blank=True)

    def __str__(self) -> str:
        return self.name
    
    def get_all_words(self):
        """Return the set of all words from the sentences of this list."""

        sentences: Iterable[Sentence] = self.sentences.all()
        words = set()
        for s in sentences:
            words.update(s.get_words())
        return words
    
    def _bulk_prepare_word_cards(self, owner: settings.AUTH_USER_MODEL):
        """Delete existing WordCards for this list and owner, and recreate in bulk."""

        words = self.get_all_words()
        word_cards = [
            WordCard(sentence_list=self, owner=owner, word=w)
            for w in words
        ]
        WordCard.objects.filter(sentence_list=self, owner=owner).delete()
        WordCard.objects.bulk_create(word_cards)

    def _create_missing_word_cards(self, owner: settings.AUTH_USER_MODEL):
        """Create WordCards for words that don't have WordCards."""

        words = self.get_all_words()
        for w in words:
            WordCard.objects.get_or_create(
                sentence_list=self, owner=owner, word=w)

    def prepare_word_cards(
        self, owner: settings.AUTH_USER_MODEL, in_bulk=False
    ):
        """Re-create WordCards for all the words in the SentenceList.

        The created WordCards are owned by the given owner.
        NOTE: All existing WordCards for the given owner for this SentenceList
        will be deleted if in_bulk is True. This is done to allow bulk creation
        of WordCards. Creating WordCards in bulk is faster.
        """

        if in_bulk:
            self._bulk_prepare_word_cards(owner)
        else:
            self._create_missing_word_cards(owner)

class WordCard(models.Model):
    """A WordCard relates a SentenceList and a word. It is owned by a user.

    The idea is to allow users to learn SentenceList specific words. For
    example, in a Turkish list, the word "biliyorum" may appear several times.
    When a user correctly answers "biliyorum", the progress is reflected in
    all sentences that contain this word within that SentenceList. Progress on
    "biliyorum" in other lists should not be affected, as often languages have
    common words.

    WordCard also implements the SM-2 algorithm to allow efficient learning.
    See: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm.
    """

    sentence_list = models.ForeignKey(SentenceList, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    word = models.CharField(max_length=50)

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

    class Meta:
        unique_together = ("owner", "sentence_list", "word")

    def __str__(self) -> str:
        return f"<{self.word}> of {self.sentence_list.name}."

    def is_up_for_review(self) -> bool:
        """Return True if the card needs to be reviewed, False otherwise."""

        days_passed = date.today() - self.last_review_date
        return days_passed >= self.inter_repetition_interval

    def update_proficiency(self, score: int) -> None:
        """Update the card's SM-2 parameters based on the given score."""

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


class UserProfile(models.Model):
    """UserProfile which stores extra information about a User."""

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )

    # When a user plays a list for the very first time, word cards are prepared
    # for all words in the list. This is an expensive operation, and is only
    # performed once for every (user, list) tuple. This field is used to
    # determine if user is playing the list for the very first time.
    played_lists = models.ManyToManyField(SentenceList)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(owner=instance)
