"""Helper or utility functions for the leasikApp app."""


from typing import List, Optional, Tuple, Set
from datetime import timedelta
from random import sample

from django.contrib.auth.models import User

from .models import Card, Sentence


def get_cards(
    user: User,
    sentences: List[Sentence],
    n: Optional[int] = None,
    retries: int = 3,
) -> List[Card]:
    """Return n applicable cards belonging to user from slist.

    A card is considered applicable if it is up for review. It is not
    guaranteed that only applicable cards will be returned; if enough
    applicable cards are not found after retrying for the specified number of
    times (default 3), the function will return some non-applicable cards.

    If n is None, return all.
    """
    all_cards_seen: Set[Card] = set()
    sample_size = len(sentences) if n is None or n > len(sentences) else n
    cards_up_for_review: Set[Card] = set()

    for _ in range(retries):
        if len(cards_up_for_review) >= sample_size:
            break

        cards: List[Card] = []
        for sentence in sample(sentences, sample_size):
            card = Card.objects.filter(owner=user, sentence=sentence).order_by(
                "?"
            )
            if (first_card := card.first()) is not None:
                cards.append(first_card)
            else:
                cards.append(
                    Card.objects.create(owner=user, sentence=sentence)
                )

        all_cards_seen.update(cards)
        cards_up_for_review.update(c for c in cards if c.is_up_for_review())

    # make sure cards_up_for_review has at least sample_size elements
    unused_cards = all_cards_seen - cards_up_for_review
    number_of_cards_required = sample_size - len(cards_up_for_review)
    if number_of_cards_required > 0:
        cards_up_for_review.update(
            sample(
                unused_cards, min(number_of_cards_required, len(unused_cards))
            )
        )

    return list(cards_up_for_review)[:sample_size]


def sm2(
    q: int, n: int, ef: float, i: timedelta
) -> Tuple[int, float, timedelta]:
    """Implement the SM-2 SRS algorithm.

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
    ef = max(ef, 1.3)

    return (n, ef, i)
