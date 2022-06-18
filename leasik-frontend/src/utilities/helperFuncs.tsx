import Card from "../models/Card";

export function normalizedCard(card: Card): Card {
  const nwords = card.sentence.text.split(/\s+/).length;

  const newCard = {
    ...card,
    hiddenWordPosition:
      card.hiddenWordPosition === -1
        ? randRange(nwords)
        : card.hiddenWordPosition,
    hiddenWordPositions: card.hiddenWordPositions.map((pos) =>
      pos === -1 ? randRange(nwords) : pos
    ),
  };

  return newCard;
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
