from datetime import timedelta, date

from django.test import TestCase
from django.contrib.auth import get_user_model

from .models import Sentence, SentenceList, WordCard


class WordCardModelTests(TestCase):
    def setUp(self):
        get_user_model().objects.create(username="mock", password="mock")
        SentenceList.objects.create(
            name="mock sentence list", owner=get_user_model().objects.get()
        )

    def test_is_up_for_review_with_newly_created_card(self):
        """A newly created card is up for review."""

        newly_created_card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=get_user_model().objects.get(),
            word="mock",
        )

        self.assertTrue(newly_created_card.is_up_for_review())

    def test_is_up_for_review_with_old_card(self):
        """An old card is up for review."""

        old_card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=get_user_model().objects.get(),
            word="mock",
        )
        old_card.last_review_date = date.today() - timedelta(days=10)
        old_card.inter_repetition_interval = timedelta(days=1)

        self.assertTrue(old_card.is_up_for_review())

    def test_is_up_for_review_with_large_inter_repetition_interval(self):
        """A card with a large inter repetition interval is not up for review."""

        card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=get_user_model().objects.get(),
            word="mock",
        )
        card.last_review_date = date.today() - timedelta(days=10)
        card.inter_repetition_interval = timedelta(days=100)

        self.assertFalse(card.is_up_for_review())

    def test_is_up_for_review_for_recently_reviewed_card(self):
        """A recently reviewed card is not up for review."""

        card = WordCard.objects.create(
            sentence_list=SentenceList.objects.get(),
            owner=get_user_model().objects.get(),
            word="mock",
        )
        card.inter_repetition_interval = timedelta(days=1)

        self.assertFalse(card.is_up_for_review())


class SentenceListModelTests(TestCase):
    def setUp(self):
        get_user_model().objects.create(username="mock", password="mock")
        SentenceList.objects.create(
            name="mock sentence list", owner=get_user_model().objects.get()
        )

    def test_prepare_word_cards_on_empty_sentence_list(self):
        SentenceList.objects.get().prepare_word_cards(
            get_user_model().objects.get()
        )

        self.assertCountEqual(WordCard.objects.all(), [])

    def test_prepare_word_cards_on_non_empty_sentence_list_with_no_cards(self):
        sl = SentenceList.objects.get()
        sl.sentences.add(
            Sentence.objects.create(text="A boy.", translation="Bir çocuk.")
        )
        sl.sentences.add(
            Sentence.objects.create(text="A girl.", translation="Une fille.")
        )
        sl.sentences.add(
            Sentence.objects.create(text="The man.", translation="L'uomo.")
        )

        sl.prepare_word_cards(get_user_model().objects.get())

        self.assertEqual(WordCard.objects.count(), 5)
        self.assertEqual(
            str(WordCard.objects.get(word="a")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="a",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="boy")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="boy",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="girl")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="girl",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="the")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="the",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="man")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="man",
                )
            ),
        )

    def test_prepare_word_cards_with_existing_cards(self):
        sl = SentenceList.objects.get()
        sl.sentences.add(
            Sentence.objects.create(text="A boy.", translation="Bir çocuk.")
        )
        sl.sentences.add(
            Sentence.objects.create(text="A girl.", translation="Une fille.")
        )
        sl.sentences.add(
            Sentence.objects.create(text="The man.", translation="L'uomo.")
        )

        sl.prepare_word_cards(get_user_model().objects.get())

        sl.sentences.add(
            Sentence.objects.create(
                text="The sandwich.", translation="Il panino."
            )
        )

        sl.prepare_word_cards(get_user_model().objects.get())

        self.assertEqual(WordCard.objects.count(), 6)
        self.assertEqual(
            str(WordCard.objects.get(word="a")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="a",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="boy")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="boy",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="girl")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="girl",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="the")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="the",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="man")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="man",
                )
            ),
        )
        self.assertEqual(
            str(WordCard.objects.get(word="sandwich")),
            str(
                WordCard(
                    sentence_list=sl,
                    owner=get_user_model().objects.get(),
                    word="sandwich",
                )
            ),
        )


class SentenceModelTests(TestCase):
    def setUp(self) -> None:
        Sentence.objects.create(
            text="I'm İstanbul'abc am k!ng: 'Fish go to.goto' inkspot.1 relax",
            translation="",
        )

    def test_contains_word_with_non_existent_word(self):
        """Should return False if word is not found inside text."""

        s = Sentence.objects.get()
        self.assertFalse(s.contains_word("amsterdam"))

    def test_contains_word_with_non_word_substring(self):
        """Should return False if found string is not word by itself.
        
        Example: m is not a whole word in the text, "I'm"."""

        s = Sentence.objects.get()
        self.assertFalse(s.contains_word("m"))
        self.assertFalse(s.contains_word("abc"))
        self.assertFalse(s.contains_word("to"))

    def test_contains_word_with_isolated_word(self):
        """Should return True for words surrounded by space on both sides."""

        s = Sentence.objects.get()
        self.assertTrue(s.contains_word("am"))
        self.assertTrue(s.contains_word("go"))

    def test_contains_word_with_words_at_start_or_end_of_text(self):
        """Should return True if word is found at start or end of sentences."""

        s = Sentence.objects.get()
        self.assertTrue(s.contains_word("I'm"))
        self.assertTrue(s.contains_word("relax"))

    def test_contains_word_with_words_mixed_with_punctuation_and_digits(self):
        """Should return True for words surrounded by punctuation and digits.
        
        Should return False if punctuation or digit occurs in the middle
        of the word.
        """

        s = Sentence.objects.get()
        
        self.assertTrue(s.contains_word("fish"))
        self.assertTrue(s.contains_word("inkspot"))
        
        self.assertFalse(s.contains_word("m"))
        self.assertFalse(s.contains_word("abc"))
        self.assertFalse(s.contains_word("i"))
        self.assertFalse(s.contains_word("İstanbul"))
        self.assertFalse(s.contains_word("m"))
        self.assertFalse(s.contains_word("to"))
        self.assertFalse(s.contains_word("goto"))
