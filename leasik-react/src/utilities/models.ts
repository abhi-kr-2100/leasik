export interface SentenceInterface {
    text: string;
    translation: string;
};

export interface CardInterface {
    id: number;
    note: string;
    sentence: SentenceInterface;
    hidden_word_position: number;
}

export interface SentenceListInterface {
    id: number;
    name: string;
    description: string;
};
