"""Helper or utility functions for the leasikApp app."""


from typing import List, Optional, Sequence, Tuple, TypeVar, Generator
from datetime import timedelta
from random import shuffle

from django.contrib.auth.models import User

from .models import Card, Sentence


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

    return cards[:n] if n is not None else cards


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
