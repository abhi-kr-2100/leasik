import { trim } from "lodash";
import { Sentence, Word } from "./types";

const punctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`
const digits = '0123456789'
const whitespace = ' \t\n\r\v\f'

export function toWords(text: string): string[] {
  return text.split(/\s+/);
}

export function chooseMaskedWord(sentence: Sentence): Word {
  return randomChoice(sentence.words);
}

export function findWordPositions(words: string[], word: string, locale: string = ""): number[] {
  let positions: number[] = [];
  for (let i = 0; i < words.length; ++i) {
    if (matches(word, words[i], locale)) {
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

export function matches(s1: string, s2: string, locale: string = "") {
  if (locale === "") {
    locale = "default";
  }

  const s1N = trim(s1, punctuation + whitespace + digits)
    .toLocaleLowerCase(locale);

  const s2N = trim(s2, punctuation + whitespace + digits)
    .toLocaleLowerCase(locale);

  return s1N === s2N;
}

export function startsWith(prefix: string, str: string, locale: string = "") {
  const barePrefix = trim(prefix, punctuation + whitespace + digits);
  return matches(barePrefix, str.slice(0, barePrefix.length), locale);
}
