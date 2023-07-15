import { min, trim } from "lodash";
import { Sentence, Word } from "./types";

export function toWords(text: string): string[] {
  return text.split(/\s+/);
}

/**
 * Choose the word to hide based on the proficiency of each word in the
 * sentence.
 */
export function chooseMaskedWord(sentence: Sentence): Word {
  const prob_nums = getProbabilityNumbers(
    sentence.words.map((word) => word.proficiencyScore)
  );
  const prob_array = getSpaceByProbabilityNumbers(sentence.words, prob_nums);

  return randomChoice(prob_array);
}

export function areEquivalent(s1: string, s2: string, locale: string = "") {
  locale = getLocaleOrDefault(locale);
  return normalizedString(s1, locale) === normalizedString(s2, locale);
}

export function startsWith(prefix: string, str: string, locale: string = "") {
  const barePrefix = normalizedString(prefix, locale);
  return areEquivalent(barePrefix, str.slice(0, barePrefix.length), locale);
}

/**
 * Probability number is the number of times an element should occur in a
 * collection so that a random uniform choice from that collection would bias
 * the overall choice according to the weights.
 *
 * For example, in a weighted coin toss if H is twice as likely as T, instead
 * of dealing with probability distributions, we can suppose the space to
 * [H, H, T] instead of [H, T]. Here, the probability number of H is 2, and the
 * probability number of T is 1.
 */
function getProbabilityNumbers(weights: number[]) {
  const normalized = normalizedWeights(weights);
  return normalized;
}

function getSpaceByProbabilityNumbers<T>(items: T[], probNums: number[]) {
  let space: T[] = [];
  items.forEach((item, idx) => {
    const repeated = Array(probNums[idx]).fill(item);
    space.push(...repeated);
  });

  return space;
}

/** Make all weights positive (greater than 0). */
function normalizedWeights(weights: number[]) {
  const base = Math.abs(min(weights) ?? 0) + 1; // plus one to make sure everything is > 0
  return weights.map((w) => w + base);
}

export function randomChoice<T>(items: T[]): T {
  return items[randRange(items.length)];
}

/** Random int in the range [0, max). */
export function randRange(max: number): number {
  return Math.floor(Math.random() * max);
}

function normalizedString(s: string, locale: string = "") {
  const punctuation = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
  const digits = "0123456789";
  const whitespace = " \t\n\r\v\f";

  return trim(s, punctuation + whitespace + digits).toLocaleLowerCase(locale);
}

function getLocaleOrDefault(locale: string = "") {
  return locale === "" ? "default" : locale;
}
