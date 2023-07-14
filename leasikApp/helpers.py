from typing import Tuple, Iterable
from datetime import timedelta


def weighted_avg(weights_with_terms: Iterable[Tuple[float, float]]) -> float:
    total_weight = sum(weight for (weight, _) in weights_with_terms)
    numerator = sum(weight * term for (weight, term) in weights_with_terms)

    return numerator / total_weight


def get_overall_proficiency_score(word_scores: Iterable):
    """Return the weighted average proficiency score of the given WordScores.

    The average is weighted by the inverse of the easiness factor (difficulty
    factor). The higher the difficulty factor, the more it contributes to the
    average.
    """

    weights_with_terms = [
        (1 / ws.easiness_factor, ws.get_proficiency_score())
        for ws in word_scores
    ]

    return weighted_avg(weights_with_terms)


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

    # As values of n greater than or equal to 2 are treated the
    # same, we cap n at 2. This prevents overflow in case of very
    # large values of n.
    n = n % 3

    # SM-2 doesn't specify any upper limit on inter-repetition interval.
    # However, since computer memory is finite, we're capping it at a very
    # large time interval.
    i = min(i, timedelta(days=365 * 10))

    return (n, ef, i)
