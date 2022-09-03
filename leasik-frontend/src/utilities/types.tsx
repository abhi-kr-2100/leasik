import Sentence from "../models/Sentence";

export type InputStatusType = "unchecked" | "correct" | "incorrect";

type SentenceNode = {
    id: string;
    text: string;
    translation: string;
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
