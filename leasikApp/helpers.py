"""Helper or utility functions for the leasikApp app."""


from typing import List, Union
from random import sample
from string import ascii_letters, digits

from django.db.models.query import QuerySet
from django.db.models import F
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

from .forms import NewSentenceForm
from .models import Proficiency, Sentence, SentenceNote, SentenceList


def get_sentence_from_form(form: NewSentenceForm) -> Sentence:
    """Create and return a sentence object from the given form.
    
    If the sentence already exists, just return it.
    """

    return Sentence.objects.get_or_create(
        text=form.cleaned_data['text'],
        translation=form.cleaned_data['translation']
    )[0]


def update_proficiency_helper(user: User, sentence_id: int) -> None:
    """Update the proficiency between the given user and sentence."""

    the_sentence: Sentence = Sentence.objects.get(id=sentence_id)
    
    Proficiency.objects.update_or_create(
        owner=user,
        sentence=the_sentence,
        defaults={'proficiency': (F('proficiency') + 1) % 100}
    )[0]


def get_sentences_in_order(user: User, sentences: QuerySet[Sentence]) -> \
        List[Sentence]:
    """Return a copy of sentences in the correct order.
    
    The order is determined as follows:
        * Less proficient sentences appear first.
        * The relative order of equally proficient sentences is random.
    """

    # since comparisions of equal Proficiencies are randomized, we don't have
    # to do anything to meet the second constraint on the order of the list
    sort_key = (
        lambda s: Proficiency.objects.get_or_create(owner=user, sentence=s)[0])
    return sorted(
        sentences,
        key=sort_key
    )


def get_notes_for_sentences(user: User,
        sentences: Union[QuerySet[Sentence], List[Sentence]]) -> \
            List[SentenceNote]:
    """Return a list of notes for each given sentence in order."""

    return [
        SentenceNote.objects.get_or_create(owner=user, sentence=s)[0] \
            for s in sentences
    ]


def update_note_helper(user: User, sentence_id: int, new_note: str) -> None:
    """Update the note of the SentenceNote between user and given sentence."""

    the_sentence = Sentence.objects.get(id=sentence_id)

    SentenceNote.objects.update_or_create(
        owner=user, sentence=the_sentence, defaults={'note': new_note}
    )

def get_unique_slug(to_slugify: str) -> str:
    """Return a unique slug by slugifying to_slugify."""

    slug = slugify(to_slugify)
    while SentenceList.objects.filter(slug=slug).count():
        slug += ''.join(sample(ascii_letters + digits, 1))

    return slug
