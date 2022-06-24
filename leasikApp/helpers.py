"""Helper or utility functions for the leasikApp app."""


from typing import Tuple
from datetime import timedelta


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

    return (n, ef, i)
