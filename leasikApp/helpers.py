"""Helper or utility functions for the leasikApp app."""


from typing import List, Optional, Sequence, Tuple, TypeVar, Generator
from datetime import timedelta, date
from random import sample, shuffle
from string import ascii_letters, digits

from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

from .forms import NewSentenceForm
from .models import Card, Sentence, SentenceList


T = TypeVar("T")


def batched(
    iter: Sequence[T], batch_size: int = 1
) -> Generator[Tuple[Sequence[T], int, int], None, None]:
    """Return iter in batches of batch_size.
    
    Additionally, include information about start and end index of the batch.
    """

    n = len(iter)
    for i in range(0, n, batch_size):
        s = i
        e = min(i + batch_size, n)

        yield (iter[s:e], s, e)


def get_sentence_from_form(form: NewSentenceForm) -> Sentence:
    """Create and return a sentence object from the given form.

    If the sentence already exists, just return it.
    """

    return Sentence.objects.get_or_create(
        text=form.cleaned_data["text"], translation=form.cleaned_data["translation"]
    )[0]


def update_proficiency_helper(
    user: User, sentence_id: int, hidden_word_position: int, score: int
) -> None:
    """Update the proficiency between the given user and sentence."""

    the_sentence: Sentence = Sentence.objects.get(id=sentence_id)
    card: Card = Card.objects.get_or_create(
        owner=user, sentence=the_sentence, hidden_word_position=hidden_word_position
    )[0]

    n, ef, i = sm2(
        score,
        card.repetition_number,
        card.easiness_factor,
        card.inter_repetition_interval,
    )

    Card.objects.filter(id=card.id).update(
        repetition_number=n,
        easiness_factor=ef,
        inter_repetition_interval=i,
        last_review_date=date.today(),
    )


def get_cards(
    user: User, sentences: List[Sentence], n: Optional[int] = None
) -> List[Card]:
    """Return n applicable cards belonging to user from slist.

    If n is None, return all.
    """

    cards: List[Card] = []
    cards_up_for_review: List[Card] = []

    shuffle(sentences)

    for batch, s, e in batched(sentences, n if n is not None else 1):
        for sentence in batch:
            card = Card.objects.filter(owner=user, sentence=sentence).order_by("?")
            if not card.exists():
                cards.append(Card.objects.create(owner=user, sentence=sentence))
            else:
                # append only one card for one sentence
                cards.append(card.first())

        cards_up_for_review.extend(c for c in cards[s:e] if c.is_up_for_review())

        if n is not None and len(cards_up_for_review) >= n:
            return cards_up_for_review[:n]

    return cards_up_for_review or cards


def sm2(q: int, n: int, ef: float, i: timedelta) -> Tuple[int, float, timedelta]:
    """Implementation of the SM-2 SRS algorithm.

    See https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm.
    """

    if q >= 3:
        if n == 0:
            i = timedelta(days=1)
        elif n == 1:
            i = timedelta(days=6)
        else:
            i = timedelta(days=round(i.days * ef))
        n += 1
    else:
        n = 0
        i = timedelta(days=1)

    ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if ef < 1.3:
        ef = 1.3

    return (n, ef, i)


def update_note_helper(
    user: User, sentence_id: int, hidden_word_position: int, new_note: str
) -> None:
    """Update the note of the SentenceNote between user and given sentence."""

    the_sentence = Sentence.objects.get(id=sentence_id)
    card = Card.objects.get_or_create(
        owner=user, sentence=the_sentence, hidden_word_position=hidden_word_position
    )[0]

    Card.objects.filter(id=card.id).update(note=new_note)


def get_unique_slug(to_slugify: str) -> str:
    """Return a unique slug by slugifying to_slugify."""

    slug = slugify(to_slugify)
    while SentenceList.objects.filter(slug=slug).count():
        slug += "".join(sample(ascii_letters + digits, 1))

    return slug


def update_card_positions(
    user: User, translation: str, new_positions: List[int]
) -> None:
    """Delete card with hidden word position -1 and add cards with new positions."""

    the_sentence: Sentence = Sentence.objects.get(translation=translation)
    the_sentence.card_set.get(hidden_word_position=-1).delete()

    for p in new_positions:
        the_sentence.card_set.get_or_create(owner=user, hidden_word_position=p)
