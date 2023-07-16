from typing import Iterable
from datetime import timedelta
from math import ceil

from django.db.models import Model


def was_saved(instance: Model):
    return instance.pk is None


def weighted_avg(weights_with_terms: Iterable[tuple[float, float]]) -> float:
    total_weight: float = sum(weight for (weight, _) in weights_with_terms)
    numerator: float = sum(
        weight * term for (weight, term) in weights_with_terms
    )

    return numerator / total_weight


def get_overall_proficiency_score(word_scores: Iterable):
    """Return the weighted average normalized proficiency score of WordScores.

    The average is weighted by the easiness factor. Since a more negative
    proficiency score of a word implies better proficiency (rather than higher
    proficiency indicating a higher proficiency), a higher overall
    proficiency of a sentence should imply a more difficult sentence.

    This is why the proficiency scores are weighted by the easiness factor
    rather than the inverse of the easiness factor: all proficiency scores are
    negative, so multiplying them by a higher easiness factor makes them even
    more negative. More negativity implies better mastery of the sentence.

    Normalization ensures that the number of word scores is irrelevant.
    """
    weights_with_terms: list[tuple[float, float]] = [
        (ws.easiness_factor, ws.get_proficiency_score()) for ws in word_scores
    ]

    return weighted_avg(weights_with_terms) / len(word_scores)


def is_answer_correct(score: int) -> bool:
    return score >= 3


def sm2(
    score: int,
    repetition_number: int,
    easiness_factor: float,
    inter_repetition_interval: timedelta,
) -> tuple[int, float, timedelta]:
    """Implement a variant of the SM-2 SRS algorithm.

    See https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm.
    """
    if score >= 3:
        # In the original SM-2 algorithm, the inter_repetition_interval may not
        # always increase even if one gets the word right. In our version, a
        # correct response always leads to an increase.
        inter_repetition_interval = timedelta(
            days=ceil(inter_repetition_interval.days * easiness_factor)
        )
        repetition_number += 1
    else:
        repetition_number = 0
        inter_repetition_interval = timedelta(days=1)

    # In the standard SM-2 algorithm, only a score of 5 increases the
    # easiness_factor, while a score of 4 leaves it unchanged. All lower scores
    # decrease it. In our version, easiness_factor is never decreased on a
    # correct answer (score >= 3).
    easiness_factor = easiness_factor + (
        0.1 - (4 - score) * (0.08 + (4 - score) * 0.02)
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
