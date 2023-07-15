// InputStatusType is useful after input has been submitted. Prior to the
// submission of the input, it's "unchecked". Afterwards, it's either "correct"
// or "incorrect".
export type InputStatusType = "unchecked" | "correct" | "incorrect";

// InputPrelimStatusType is useful before input has been submitted. It is used
// to indicate to the user if he's proceeding in the right direction with the
// answer. If the correct answer is "apple" and the user types "a", the status
// should be "partial" as "a" is a valid start for "apple". The status will be
// "correct" when the user arrives at "apple". Otherwise, it'll be "incorrect".
// The prelim status starts out "partial".
// This type has been added in an effort to fix Issue #39. In particular, it's
// been inspired by this comment: https://github.com/abhi-kr-2100/leasik/issues/39#issuecomment-1272548336
export type InputPrelimStatusType = "correct" | "incorrect" | "partial";

type WordNode = {
    id: string;
    word: string;
    proficiencyScore: number;
}

type WordEdge = {
    node: WordNode;
}

export type SentenceNode = {
    id: string;
    text: string;
    translation: string;
    textLocale: string;
    textLanguage: string;
    wordSet: { edges: WordEdge[] };
}

export type SentenceEdge = {
    node: SentenceNode;
}

export type Word = {
    id: string;
    word: string;
    score: number;
}

export type Sentence = {
    id: string;
    text: string;
    translation: string;
    locale: string;
    language: string;
    words: Word[];
}
