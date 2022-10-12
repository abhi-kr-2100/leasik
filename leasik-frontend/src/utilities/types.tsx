import Sentence from "../models/Sentence";

// InputStatusType is useful after input has been submitted. Prior to the
// submission of the input, it's "unchecked". Afterwards, it's either "correct"
// or "incorrect".
export type InputStatusType = "unchecked" | "correct" | "incorrect";

// InputPrelimStatusType is useful before input has been submitted. It is used
// to indicate to the user whether the input he's about to submit is correct or
// not. The prelim status starts out incorrect and becomes correct after the
// user arrives at the correct answer.
// This type has been added in an effort to fix Issue #39. In particular, it's
// been inspired by this comment: https://github.com/abhi-kr-2100/leasik/issues/39#issuecomment-1272548336
export type InputPrelimStatusType = "correct" | "incorrect";

type SentenceNode = {
    id: string;
    text: string;
    translation: string;
    textLanguage: string;
    textLocale: string;
}

type SentenceEdge = {
    node: SentenceNode;
}

type WordCardNode = {
    id: string;
    word: string;
    sentences: { edges: SentenceEdge[] };
}

export type WordCardEdge = {
    node: WordCardNode;
}

export type ExtendedWordCard = {
    id: string;
    word: string;
    sentence: Sentence;
    hiddenWordPosition: number;
}
