export interface ISentence {
    text: string;
    translation: string;
}

export interface ICardBase {
    id: string | BigInt;
    note: string;
    sentence: ISentence;
    hidden_word_position: number;
    is_bookmarked: boolean;
}

export interface ICard extends ICardBase {
    id: BigInt;
}

export interface ISentenceListBase {
    id: string | BigInt;
    name: string;
    description: string;
}

export interface ISentenceList extends ISentenceListBase {
    id: BigInt;
}
