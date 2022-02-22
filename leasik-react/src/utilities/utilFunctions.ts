import { ICard, ICardBase, ISentenceList, ISentenceListBase } from "./models";

export function getWords(s: string) {
    return s.split(" ").filter((w) => w !== "");
}

export function convertToConcreteCard(card: ICard): ICard {
    // select a random hidden_word_position, if it's -1
    if (card.hidden_word_position !== -1) {
        return { ...card };
    }

    const words = getWords(card.sentence.text);
    const hiddenWordPosition = Math.floor(Math.random() * words.length);

    return { ...card, hidden_word_position: hiddenWordPosition };
}

export function convertToConcreteCards(cards: ICard[]): ICard[] {
    return cards.map(convertToConcreteCard);
}

export function convertBaseToExtended(baseObject: ICardBase): ICard;
export function convertBaseToExtended(
    baseObject: ISentenceListBase
): ISentenceList;
export function convertBaseToExtended(
    baseObject: ICardBase | ISentenceListBase
): ISentenceList | ICard {
    return { ...baseObject, id: BigInt(baseObject.id as string) };
}

export function semanticallyEqual(sent1: string, sent2: string): boolean {
    return normalizeString(sent1) === normalizeString(sent2);
}

export function normalizeString(s: string) {
    return s
        .replace(/[^\p{L}\s]/gu, "")
        .replace(/\s{2,}/g, " ")
        .toLowerCase();
}

interface IHasID {
    id: BigInt;
}

export function getID(object: IHasID): BigInt {
    return object.id;
}

interface IPrintable {
    toString: () => string;
}

export function toString(object: IPrintable): string {
    return object.toString();
}
