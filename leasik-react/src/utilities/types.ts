import { ICard, ISentence } from "./models";

export interface IAugmentedCard extends ICard {
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
    is_bookmarked: boolean;
    isDeletedOnServer: boolean;
    sisterCards: AugmentedCard[];

    static fromCard(
        card: ICard,
        isDeletedOnServer = false,
        sisterCards: AugmentedCard[] = []
    ): AugmentedCard {
        const { id, note, sentence, hidden_word_position, is_bookmarked } =
            card;
        const object = new AugmentedCard(
            id,
            note,
            sentence,
            hidden_word_position,
            is_bookmarked,
            isDeletedOnServer,
            sisterCards
        );

        return object;
    }

    static fromCards(
        cards: ICard[],
    ): AugmentedCard[] {
        return cards.map(card => AugmentedCard.fromCard(card));
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
        this.is_bookmarked = isBookmarked;
        this.isDeletedOnServer = isDeletedOnServer;
        this.sisterCards = sisterCards;
    }
}

export type answerStatusType = "unchecked" | "correct" | "incorrect";
