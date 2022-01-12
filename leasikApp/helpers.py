"""Helper or utility functions for the leasikApp app."""


from collections import OrderedDict

from .models import Proficiency, Sentence, List


def add_sentence_to_list(owner, slug, form):
    """Add the sentence in form to the list with the given slug and owner."""

    the_list = List.objects.get(owner=owner, slug=slug)
    the_sentence = Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        translation=form.cleaned_data['translation']
    )[0]

    the_list.sentences.add(the_sentence)


def update_each_proficiency(user, data_items):
    """Update the proficiency of user with each sentence in data_items."""

    for item in data_items:
        sentence = Sentence.objects.get(
            text=item['text'], translation=item['translation'])
        to_update = Proficiency.objects.get(
            user=user, sentence=sentence)

        new_proficiency = (to_update.proficiency + 1) % 100
        to_update.proficiency = new_proficiency
        to_update.save(update_fields=['proficiency'])


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
