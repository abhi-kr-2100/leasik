from django.test import TestCase

from .models import Sentence, Word


class SentenceModelTests(TestCase):
    def setUp(self) -> None:
        Sentence.objects.create(
            text="I'm İstanbul'abc am k!ng: 'Fish go to.goto' inkspot.1 relax",
            translation="",
        )

    def test_word_models_are_created(self):
        s = Sentence.objects.get()
        words = s.get_words()
        word_models = Word.objects.all()

        self.assertEqual(len(words), word_models.count())

        for wm in word_models:
            self.assertTrue(wm.word in words)
