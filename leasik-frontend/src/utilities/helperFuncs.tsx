import { trim } from "lodash";

const punctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`
const digits = '0123456789'
const whitespace = ' \t\n\r\v\f'

export function toWords(text: string): string[] {
  return text.split(/\s+/);
}

export function findWordPositions(words: string[], word: string): number[] {
  let positions: number[] = [];
  for (let i = 0; i < words.length; ++i) {
    if (matches(word, words[i])) {
      positions.push(i);
    }
  }

  return positions;
}

export function randomChoice<T>(items: T[]): T {
  return items[randRange(items.length)];
}

export function randRange(max: number): number {
  return Math.floor(Math.random() * max);
}

export function matches(s1: string, s2: string) {
  // upper -> lower so that Turkish İ's and I's are considered the same
  // a (bad) fix for https://github.com/abhi-kr-2100/leasik/issues/11
  const s1N = trim(s1, punctuation + whitespace + digits)
    .toUpperCase()
    .toLowerCase();

  const s2N = trim(s2, punctuation + whitespace + digits)
    .toUpperCase()
    .toLowerCase();

  return s1N === s2N;
}
