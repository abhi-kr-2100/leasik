// InputStatus is useful after input has been submitted. Prior to the
// submission of the input, it's "unchecked". Afterwards, it's either "correct"
// or "incorrect".
export type InputStatus = "unchecked" | "correct" | "incorrect";

// InputPrelimStatus is useful before input has been submitted. It is used to
// indicate to the user if he's proceeding in the right direction with the
// answer. If the correct answer is "apple" and the user types "a", the status
// should be "partial" as "a" is a valid start for "apple". The status will be
// "correct" when the user arrives at "apple". Otherwise, it'll be "incorrect".
// The prelim status starts out "partial".
// This type has been added in an effort to fix Issue #39. In particular, it's
// been inspired by this comment: https://github.com/abhi-kr-2100/leasik/issues/39#issuecomment-1272548336
export type InputPrelimStatus = "correct" | "incorrect" | "partial";

export type Book = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type Sentence = {
  id: string;
  text: string;
  translation: string;
  textLocale: string;
  textLanguage: string;
  words: Word[];
};

export type Word = {
  id: string;
  word: string;
  proficiencyScore: number;
};

export type BookEdge = {
  node: BookNode;
};

type BookNode = {
  id: string;
  name: string;
  description: string;
  tags: { edges: TagEdge[] };
};

export type SentenceEdge = {
  node: SentenceNode;
};

type SentenceNode = {
  id: string;
  text: string;
  translation: string;
  textLocale: string;
  textLanguage: string;
  wordSet: { edges: WordEdge[] };
};

type WordEdge = {
  node: WordNode;
};

type WordNode = {
  id: string;
  word: string;
  proficiencyScore: number;
};

type TagEdge = {
  node: TagNode;
};

type TagNode = {
  id: string;
  label: string;
};
