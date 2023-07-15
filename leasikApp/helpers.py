from typing import Iterable
from datetime import timedelta


def weighted_avg(weights_with_terms: Iterable[tuple[float, float]]) -> float:
    total_weight: float = sum(weight for (weight, _) in weights_with_terms)
    numerator: float = sum(
        weight * term for (weight, term) in weights_with_terms
    )

    return numerator / total_weight


def get_overall_proficiency_score(word_scores: Iterable):
    """Return the weighted average proficiency score of the given WordScores.

    The average is weighted by the inverse of the easiness factor (whcih could
    be called the difficulty factor). The higher the difficulty factor, the
    more it contributes to the average.
    """
    weights_with_terms: list[tuple[float, float]] = [
        (1 / ws.easiness_factor, ws.get_proficiency_score())
        for ws in word_scores
    ]

    return weighted_avg(weights_with_terms)


def sm2(
    score: int,
    repetition_number: int,
    easiness_factor: float,
    inter_repetition_interval: timedelta,
) -> tuple[int, float, timedelta]:
    """Implement the SM-2 SRS algorithm.

    See https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm.
    """
    if score >= 3:
        if repetition_number == 0:
            inter_repetition_interval = timedelta(days=1)
        elif repetition_number == 1:
            inter_repetition_interval = timedelta(days=6)
        else:
            inter_repetition_interval = timedelta(
                days=round(inter_repetition_interval.days * easiness_factor)
            )
        repetition_number += 1
    else:
        repetition_number = 0
        inter_repetition_interval = timedelta(days=1)

    easiness_factor = easiness_factor + (
        0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)
    )
    easiness_factor = max(easiness_factor, 1.3)

    # As values of n greater than or equal to 2 are treated the
    # same, we cap n at 2. This prevents overflow in case of very
    # large values of n.
    repetition_number = repetition_number % 3

    # SM-2 doesn't specify any upper limit on inter-repetition interval.
    # However, since computer memory is finite, we're capping it at a very
    # large time interval.
    inter_repetition_interval = min(
        inter_repetition_interval, timedelta(days=365 * 10)
    )

    return (repetition_number, easiness_factor, inter_repetition_interval)
