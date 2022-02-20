export type SentenceType = {
    text: string;
    translation: string;
};

export interface CardInterface {
    id: number;
    note: string;
    sentence: SentenceType;
    hidden_word_position: number;
}

export type SentenceListType = {
    id: number;
    name: string;
    description: string;
};
