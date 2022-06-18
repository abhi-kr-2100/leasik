import Card from "../models/Card";

export function normalizedCard(card: Card): Card {
  const nwords = toWords(card.sentence.text).length;
  const randomReplacement = randRange(nwords);

  const newCard: Card = {
    ...card,
  };

  // The job of this function is to deal with a hidden word position of -1
  // consistently, i.e., all -1s should map to a single value. However, only
  // the hidden word position of the card is significant (as opposed to the
  // hidden word positions of the sister cards). Hence, when the hidden word
  // position of the main card is already valid, we simply remove all -1s from
  // the hidden word positions of the sister cards.
  if (newCard.hiddenWordPosition === -1) {
    newCard.hiddenWordPosition = randomReplacement;
    newCard.hiddenWordPositions = card.hiddenWordPositions.map((hwp) =>
      hwp === -1 ? randomReplacement : hwp
    );
  } else {
    newCard.hiddenWordPositions = newCard.hiddenWordPositions.filter(
      (hwp) => hwp !== -1
    );
  }

  return newCard;
}

export function toWords(text: string): string[] {
  return text.split(/\s+/);
}

export function randRange(max: number): number {
  return Math.floor(Math.random() * max);
}

export function partitionSentence(
  sentence: string,
  position: number
): string[] {
  const words = sentence.split(/\s+/);

  const pre = words.slice(0, position);
  const word = words[position];
  const post = words.slice(position + 1);

  const preSentence = pre.join(" ");
  const postSentence = post.join(" ");

  return [preSentence, word, postSentence];
}

export function matches(s1: string, s2: string) {
  // lower -> upper so that Turkish İ's and I's are considered the same
  // a (bad) fix for https://github.com/abhi-kr-2100/leasik/issues/11
  const s1N = s1
    .replace(/[^\p{L}\s]/gu, "")
    .toLowerCase()
    .toUpperCase();

  const s2N = s2
    .replace(/[^\p{L}\s]/gu, "")
    .toLowerCase()
    .toUpperCase();

  return s1N === s2N;
}
