export interface ISentence {
    text: string;
    translation: string;
};

export interface ICard {
    id: number;
    note: string;
    sentence: ISentence;
    hidden_word_position: number;
}

export interface ISentenceList {
    id: number;
    name: string;
    description: string;
};
