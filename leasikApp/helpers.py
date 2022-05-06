"""Helper or utility functions for the leasikApp app."""


from typing import List, Optional, Tuple, Set
from datetime import timedelta
from random import sample

from django.contrib.auth.models import User

from leasikREST.serializers import AugmentedCardSerializer, CardSerializer

from .models import Bookmark, Card, Sentence, SentenceList


def get_one_card(user: User, sentence: Sentence):
    """Return one random user owned card belonging to sentence."""

    card = Card.objects.filter(owner=user, sentence=sentence).order_by("?")

    # cards for the sentence may or may not exist; create one if doesn't exist
    if (first_card := card.first()) is not None:
        return first_card
    else:
        return Card.objects.create(owner=user, sentence=sentence)


def get_n_cards(user: User, sentences: List[Sentence], n: int):
    """Return one card each from n sentences owned by user.

    Assumes that len(sentences) >= n.
    """

    cards = [get_one_card(user, sentence) for sentence in sample(sentences, n)]
    return cards


def get_cards(
    user: User,
    sentences: List[Sentence],
    n: Optional[int] = None,
    retries: int = 3,
) -> List[Card]:
    """Return n applicable user owned cards belonging to sentences.

    A card is considered applicable if it is up for review. It is not
    guaranteed that only applicable cards will be returned; if enough
    applicable cards are not found after retrying for the specified number of
    times (default 3), the function will return some non-applicable cards.

    If n is None, return all.
    """
    # number of cards to return
    sample_size = len(sentences) if n is None or n > len(sentences) else n

    all_cards_seen: Set[Card] = set()  # regardless of applicability
    applicable_cards: Set[Card] = set()

    for _ in range(retries):
        if len(applicable_cards) >= sample_size:
            break

        cards: List[Card] = get_n_cards(user, sentences, sample_size)
        all_cards_seen.update(cards)
        applicable_cards.update(c for c in cards if c.is_up_for_review())

    # make sure cards_up_for_review has at least sample_size elements
    inapplicable_cards = all_cards_seen - applicable_cards
    extra_cards_required = sample_size - len(applicable_cards)

    if extra_cards_required > 0:
        applicable_cards.update(
            sample(
                inapplicable_cards,
                min(extra_cards_required, len(inapplicable_cards)),
            )
        )

    return list(applicable_cards)[:sample_size]


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


def augmented_cards(
    owner: User, sentence_list: SentenceList, cards: List[Card]
) -> AugmentedCardSerializer:
    """Augment the cards with bookmark information and return."""
    bookmark = Bookmark.objects.get_or_create(
        owner=owner, sentence_list=sentence_list
    )[0]
    bookmarked_cards = bookmark.cards.values_list("id", flat=True)

    data = [
        {**CardSerializer(c).data, "is_bookmarked": c.id in bookmarked_cards}
        for c in cards
    ]

    return AugmentedCardSerializer(data=data, many=True)


def converted_to_augmented_cards(
    cards: List[Card], are_bookmarked: bool
) -> AugmentedCardSerializer:
    """Augment the cards with given bookmark information and return."""

    data = [
        {**CardSerializer(c).data, "is_bookmarked": are_bookmarked}
        for c in cards
    ]

    return AugmentedCardSerializer(data=data, many=True)
