import Card from "../models/Card";

export function normalizedCard(card: Card): Card {
  const nwords = toWords(card.sentence.text).length;

  const newCard: Card = {
    ...card,
    hiddenWordPosition:
      card.hiddenWordPosition === -1
        ? randRange(nwords)
        : card.hiddenWordPosition,
  };

  return newCard;
}

export function toWords(text: string): string[] {
  return text.split(/\s+/);
}

export function randRange(max: number): number {
  return Math.floor(Math.random() * max);
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
