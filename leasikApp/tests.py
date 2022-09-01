from datetime import timedelta, date

from django.test import TestCase
from django.contrib.auth.models import User

from .models import SentenceList, WordCard


class WordCardModelTests(TestCase):
    def setUp(self):
        User.objects.create(username="mock", password="mock")
        SentenceList.objects.create(
            name="mock sentence list", owner=User.objects.get()
        )

    def test_is_up_for_review_with_newly_created_card(self):
        """A newly created card is up for review."""

        newly_created_card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=User.objects.get(),
            word="mock",
        )

        self.assertTrue(newly_created_card.is_up_for_review())

    def test_is_up_for_review_with_old_card(self):
        """An old card is up for review."""

        old_card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=User.objects.get(),
            word="mock",
        )
        old_card.last_review_date = date.today() - timedelta(days=10)
        old_card.inter_repetition_interval = timedelta(days=1)

        self.assertTrue(old_card.is_up_for_review())

    def test_is_up_for_review_with_large_inter_repetition_interval(self):
        """A card with a large inter repetition interval is not up for review."""

        card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=User.objects.get(),
            word="mock",
        )
        card.last_review_date = date.today() - timedelta(days=10)
        card.inter_repetition_interval = timedelta(days=100)

        self.assertFalse(card.is_up_for_review())

    def test_is_up_for_review_for_recently_reviewed_card(self):
        """A recently reviewed card is not up for review."""

        card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=User.objects.get(),
            word="mock",
        )
        card.inter_repetition_interval = timedelta(days=1)

        self.assertFalse(card.is_up_for_review())
