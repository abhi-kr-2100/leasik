"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict

from .models import Proficiency, Sentence, List


def get_sentence_from_form(form):
    """Create and return a sentence object from the given form.
    
    If the sentence already exists, just return it.
    """

    return Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        translation=form.cleaned_data['translation']
    )[0]


def update_proficiency_helper(user, sentence_id):
    """Update the proficiency between the given user and sentence."""

    the_sentence = Sentence.objects.get(id=sentence_id)
    the_proficiency = Proficiency.objects.get(user=user, sentence=the_sentence)

    new_proficiency = (the_proficiency.proficiency + 1) % 100
    the_proficiency.proficiency = new_proficiency
    the_proficiency.save(update_fields=['proficiency'])


def get_sentences_in_order(user, sentences):
    """Return a copy of sentences in the correct order.
    
    The order is determined as follows:
        * Less proficient sentences appear first.
        * The relative order of equally proficient sentences is random.
    """

    return sorted(
        sentences,
        key=lambda s: Proficiency.objects.get_or_create(user=user, sentence=s)
    )
