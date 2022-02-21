
import { ICard, ISentence } from "./models";

export interface IAugmentedCard extends ICard {
    isBookmarked: boolean;
    isDeletedOnServer: boolean;

    // sister cards are have the same sentence but different ids
    // other properties may or not differ
    sisterCards: AugmentedCard[];
}

export class AugmentedCard implements IAugmentedCard {
    id: BigInt;
    note: string;
    sentence: ISentence;
    hidden_word_position: number;
    isBookmarked: boolean;
    isDeletedOnServer: boolean;
    sisterCards: AugmentedCard[];

    static fromCard(
        card: ICard,
        isBookmarked: boolean,
        isDeletedOnServer = false,
        sisterCards: AugmentedCard[] = []
    ): AugmentedCard {
        const { id, note, sentence, hidden_word_position } = card;
        const object = new AugmentedCard(
            id,
            note,
            sentence,
            hidden_word_position,
            isBookmarked,
            isDeletedOnServer,
            sisterCards
        );

        return object;
    }

    constructor(
        id: BigInt,
        note: string,
        sentence: ISentence,
        hiddenWordPosition: number,
        isBookmarked: boolean,
        isDeletedOnServer = false,
        sisterCards: AugmentedCard[] = []
    ) {
        this.id = id;
        this.note = note;
        this.sentence = sentence;
        this.hidden_word_position = hiddenWordPosition;
        this.isBookmarked = isBookmarked;
        this.isDeletedOnServer = isDeletedOnServer;
        this.sisterCards = sisterCards;
    }
}

export type answerStatusType = "unchecked" | "correct" | "incorrect";
