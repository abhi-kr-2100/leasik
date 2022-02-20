import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Dialog, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { CardInterface, SentenceType } from "../../utilities/models";
import { getToken } from "../../utilities/authentication";
import {
    getWords,
    semanticallyEqual,
    convertToConcreteCard,
} from "../../utilities/utilFunctions";
import {
    removeBookmark,
    addBookmark,
    updateProficiency,
    isBookmarked,
    replaceWithNewCards,
} from "../../utilities/apiCalls";

interface AugmentedCardInterface extends CardInterface {
    isBookmarked: boolean;
    isDeletedOnServer: boolean;

    // sister cards are have the same sentence but different ids
    // other properties may or not differ
    sisterCards: AugmentedCard[];
}

class AugmentedCard implements AugmentedCardInterface {
    id: number;
    note: string;
    sentence: SentenceType;
    hidden_word_position: number;
    isBookmarked: boolean;
    isDeletedOnServer: boolean;
    sisterCards: AugmentedCard[];

    static fromCard(
        card: CardInterface,
        isBookmarked: boolean,
        isDeletedOnServer: boolean = false,
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
        id: number,
        note: string,
        sentence: SentenceType,
        hiddenWordPosition: number,
        isBookmarked: boolean,
        isDeletedOnServer: boolean = false,
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

type answerStatusType = "unchecked" | "correct" | "incorrect";

type BookmarkButtonPropsType = { card: AugmentedCard; onBookmark: () => any };
function BookmarkButton({ card, onBookmark }: BookmarkButtonPropsType) {
    const classNames = [
        "button",
        card.isBookmarked ? "is-danger" : "is-info",
    ].join(" ");
    const buttonText = card.isBookmarked ? "Remove Bookmark" : "Bookmark";

    return (
        <button onClick={onBookmark} className={classNames}>
            {buttonText}
        </button>
    );
}

type EditCardsButtonPropsType = {
    card: CardInterface;
    onStartEditingCards: () => any;
    onSaveEdits: (wordIndicesToSave: number[]) => any;
    onCancelEdits: () => any;
};
function EditCardsButton({
    card,
    onStartEditingCards,
    onSaveEdits,
    onCancelEdits,
}: EditCardsButtonPropsType) {
    // clicking on the EditCardsButton causes an edit dialog box to open
    const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);

    return (
        <div>
            <button
                className="button is-info"
                onClick={openDialogBoxAndStartEditProcess}
            >
                Edit Cards
            </button>
            <EditCardsDialogBox
                card={card}
                open={isDialogBoxOpen}
                /* onClose implies cancel because action should only be saved
                    if user explicity clicks the save button. Click outside the
                    box is considered a cancel.
                 */
                onClose={onCancel}
                onCancel={onCancel}
                onSave={onSave}
            />
        </div>
    );

    function openDialogBoxAndStartEditProcess() {
        onStartEditingCards();
        setIsDialogBoxOpen(true);
    }

    function onCancel() {
        onCancelEdits();
        setIsDialogBoxOpen(false);
    }

    function onSave(wordIndicesToSave: number[]) {
        onSaveEdits(wordIndicesToSave);
        setIsDialogBoxOpen(false);
    }
}

type EditCardsDialogBoxPropsType = {
    card: CardInterface;
    open: boolean;
    onClose: () => any;
    onCancel: () => any;
    onSave: (wordIndicesToSave: number[]) => any;
};
function EditCardsDialogBox({
    card,
    open,
    onClose,
    onCancel,
    onSave,
}: EditCardsDialogBoxPropsType) {
    const words = getWords(card.sentence.text);
    const wordSelectButtons = words.map((w, i) => (
        <ToggleButton value={i} key={i}>
            {w}
        </ToggleButton>
    ));

    const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>(
        []
    );

    return (
        <Dialog onClose={onClose} open={open}>
            <ToggleButtonGroup
                orientation="vertical"
                value={selectedWordIndices}
                onChange={onSelect}
            >
                {wordSelectButtons}
            </ToggleButtonGroup>

            <div>
                <button className="button is-danger" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="button is-success"
                    onClick={saveSelectedWordIndices}
                >
                    Save
                </button>
            </div>
        </Dialog>
    );

    function onSelect(
        e: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) {
        setSelectedWordIndices(newSelectedWordIndices);
    }

    function saveSelectedWordIndices() {
        return onSave(selectedWordIndices);
    }
}

type UtilityButtonsPropsType = {
    card: AugmentedCard;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
};
function UtilityButtons({
    card,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
}: UtilityButtonsPropsType) {
    return (
        <div className="container">
            <div className="buttons is-centered">
                <BookmarkButton card={card} onBookmark={onBookmark} />
                <EditCardsButton
                    card={card}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEdits={onCancelEditingCards}
                    onSaveEdits={onSaveEditingCards}
                />
            </div>
        </div>
    );
}

type AnswerButtonsPropsType = {
    answerStatus: answerStatusType;
    onAnswerCheck: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
};
function AnswerButtons({
    answerStatus,
    onAnswerCheck,
    onNext,
}: AnswerButtonsPropsType) {
    const isAnswerUnchcked = answerStatus === "unchecked";

    const submitFunction = isAnswerUnchcked ? onAnswerCheck : onNext;
    const buttonText = isAnswerUnchcked ? "Check" : "Next";

    return (
        <div className="container has-text-centered block">
            <button className="button is-primary" onClick={submitFunction}>
                {buttonText}
            </button>
        </div>
    );
}

type QuestionPropsType = {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onInputChange: (arg0: string) => any;
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any;
};
function Question({
    card,
    answerStatus,
    currentInput,
    onInputChange,
    onEnterKeyPress,
}: QuestionPropsType) {
    const words = getWords(card.sentence.text);

    // `Question`s are fill-in-the-blanks type questions.
    // `card.hidden_word_position` determines the blank, and `preBlank` and
    // `postBlank` are parts of the sentence that occur before and after the
    // blank
    const preBlank = words.slice(0, card.hidden_word_position).join(" ");
    const postBlank = words.slice(card.hidden_word_position + 1).join(" ");

    const statusToClassName = {
        correct: "has-text-success",
        incorrect: "has-text-danger",
        unchecked: "",
    };

    const classNames = [
        "title has-text-centered input is-static",
        statusToClassName[answerStatus],
    ].join(" ");

    const isAnswerChecked = answerStatus !== "unchecked";

    return (
        <div className="block">
            <p className="title is-3">{preBlank}</p>
            <input
                value={currentInput}
                onChange={onChange}
                onKeyPress={onKeyPress}
                className={classNames}
                readOnly={isAnswerChecked}
                autoFocus
            />
            <p className="title is-3">{postBlank}</p>
        </div>
    );

    function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            return onEnterKeyPress(e);
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        return onInputChange(e.target.value);
    }
}

type QuestionHintPropsType = { card: CardInterface };
function QuestionHint({ card }: QuestionHintPropsType) {
    return (
        <div className="block">
            <p className="title is-6">{card.sentence.translation}</p>
            <div className="block">
                <textarea
                    className="textarea is-info"
                    defaultValue={card.note}
                />
            </div>
        </div>
    );
}

type QuestionAreaPropsType = {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (arg0: string) => any;
};
function QuestionArea({
    card,
    answerStatus,
    currentInput,
    onEnterKeyPress,
    onInputChange,
}: QuestionAreaPropsType) {
    return (
        <div className="container has-text-centered">
            <Question
                card={card}
                answerStatus={answerStatus}
                currentInput={currentInput}
                onEnterKeyPress={onEnterKeyPress}
                onInputChange={onInputChange}
            />

            <QuestionHint card={card} />
        </div>
    );
}

type QuizDisplayPropsType = {
    card: AugmentedCard;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (arg0: string) => any;
    onAnswerCheck: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
};
function QuizDisplay({
    card,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
    answerStatus,
    currentInput,
    onEnterKeyPress,
    onInputChange,
    onAnswerCheck,
    onNext,
}: QuizDisplayPropsType) {
    return (
        <div className="pt-5">
            <div className="hero-head">
                <UtilityButtons
                    card={card}
                    onBookmark={onBookmark}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEditingCards={onCancelEditingCards}
                    onSaveEditingCards={onSaveEditingCards}
                />
            </div>

            <div className="hero-body">
                <QuestionArea
                    card={card}
                    currentInput={currentInput}
                    answerStatus={answerStatus}
                    onEnterKeyPress={onEnterKeyPress}
                    onInputChange={onInputChange}
                />
            </div>

            <div className="hero-footer">
                <AnswerButtons
                    answerStatus={answerStatus}
                    onAnswerCheck={onAnswerCheck}
                    onNext={onNext}
                />
            </div>
        </div>
    );
}

type GeneralListPlayCorePropsType = {
    token: string;
    sentenceListID: number;
    initialCards: Promise<CardInterface[]>;
    assumeDefaultBookmarkValue?: boolean;
};
function GeneralListPlayCore({
    token,
    sentenceListID,
    initialCards,
    assumeDefaultBookmarkValue,
}: GeneralListPlayCorePropsType) {
    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState<AugmentedCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [currentCardAnswerStatus, setCurrentCardAnswerStatus] =
        useState<answerStatusType>("unchecked");

    useEffect(() => {
        setIsLoading(true);
        initialCards
            .then((normalCards) => normalCards.map(convertToConcreteCard))
            .then((concreteCards) =>
                Promise.all(concreteCards.map(toAugmentedCard))
            )
            .then(setCards)
            .catch((err) => alert(`Couldn't load cards. ${err}`))
            .finally(() => setIsLoading(false));

        async function toAugmentedCard(
            normalCard: CardInterface
        ): Promise<AugmentedCard> {
            if (assumeDefaultBookmarkValue) {
                return Promise.resolve(
                    AugmentedCard.fromCard(
                        normalCard,
                        assumeDefaultBookmarkValue
                    )
                );
            }

            const bookmarkStatus = await isBookmarked(
                token,
                sentenceListID,
                normalCard.id
            );
            return AugmentedCard.fromCard(normalCard, bookmarkStatus);
        }
    }, [token, initialCards, sentenceListID, assumeDefaultBookmarkValue]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (currentCardIndex === cards.length) {
        return <div>Quiz finished!</div>;
    }

    return (
        <QuizDisplay
            answerStatus={currentCardAnswerStatus}
            card={cards[currentCardIndex]}
            currentInput={userInput}
            onAnswerCheck={checkAnswer}
            onBookmark={toggleBookmarkStatusOfCurrentCard}
            onStartEditingCards={() => {}}
            onCancelEditingCards={() => {}}
            onSaveEditingCards={saveEditToCards}
            onEnterKeyPress={enterCheckAndNext}
            onInputChange={setUserInput}
            onNext={nextCard}
        />
    );

    async function saveEditToCards(wordIndicesToSave: number[]): Promise<any> {
        if (wordIndicesToSave.length === 0) {
            return;
        }

        const currentCard = cards[currentCardIndex];
        const currentCardUpdated = { ...currentCard, isDeletedOnServer: true };
        const cardsCopyWithUpdatedCurrentCard = cards
            .slice(0, currentCardIndex)
            .concat(currentCardUpdated)
            .concat(cards.slice(currentCardIndex + 1));

        const cardsToReplace = currentCard.isDeletedOnServer
            ? currentCard.sisterCards
            : [currentCard];
        const cardsExceptLastCard = cardsToReplace.slice(
            0,
            cardsToReplace.length - 1
        );
        const lastCard = cardsToReplace[cardsToReplace.length - 1];

        return Promise.all(
            cardsExceptLastCard.map((c) => replaceWithNewCards(token, c.id, []))
        )
            .then((_) =>
                replaceWithNewCards(token, lastCard.id, wordIndicesToSave)
            )
            .then((sisterCards) =>
                sisterCards.map((c) =>
                    AugmentedCard.fromCard(c, currentCardUpdated.isBookmarked)
                )
            )
            .then(setSisterCards)
            .then((augmentedSisterCards) => {
                if (!currentCardUpdated.isBookmarked) {
                    return;
                }

                augmentedSisterCards.map((c) =>
                    addBookmark(token, sentenceListID, c.id)
                );
            })
            .then((_) => setCards(cardsCopyWithUpdatedCurrentCard))
            .catch((err) => alert(`Couldn't update cards. ${err}`));

        function setSisterCards(sisterCards: AugmentedCard[]) {
            return (cardsCopyWithUpdatedCurrentCard[
                currentCardIndex
            ].sisterCards = sisterCards);
        }
    }

    async function toggleBookmarkStatusOfCurrentCard() {
        const cardsCopy = cards.slice();
        const currentCard = cardsCopy[currentCardIndex];

        const apiFunction = currentCard.isBookmarked
            ? removeBookmark
            : addBookmark;

        const cardsToUpdate = currentCard.isDeletedOnServer
            ? currentCard.sisterCards
            : [currentCard];

        return cardsToUpdate.map(async (c) => {
            try {
                await apiFunction(token, sentenceListID, c.id);
                currentCard.isBookmarked = !currentCard.isBookmarked;
                return setCards(cardsCopy);
            } catch (err) {
                return alert(`Couldn't toggle bookmark. ${err}`);
            }
        });
    }

    function checkAnswerCore() {
        const currentCard = cards[currentCardIndex];
        const correctAnswer = getWords(currentCard.sentence.text)[
            currentCard.hidden_word_position
        ];

        const score = semanticallyEqual(userInput, correctAnswer) ? 5 : 0;

        if (score === 0) {
            setCurrentCardAnswerStatus("incorrect");
        } else {
            setCurrentCardAnswerStatus("correct");
        }

        setUserInput(correctAnswer);

        const cardToCheck = !currentCard.isDeletedOnServer
            ? currentCard
            : currentCard.sisterCards.find(hasSameHiddenWordPosition);

        if (cardToCheck !== undefined) {
            updateProficiency(token, cardToCheck.id, score).catch((err) =>
                alert(`Couldn't update card proficiency. ${err}`)
            );
        }

        function hasSameHiddenWordPosition(sisterCard: AugmentedCard): boolean {
            return (
                currentCard.hidden_word_position ===
                sisterCard.hidden_word_position
            );
        }
    }

    function checkAnswer(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        checkAnswerCore();
    }

    function nextCardCore() {
        setCurrentCardIndex(currentCardIndex + 1);
        setUserInput("");
        setCurrentCardAnswerStatus("unchecked");
    }

    function nextCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        nextCardCore();
    }

    function enterCheckAndNext(e: React.KeyboardEvent<HTMLInputElement>) {
        e.preventDefault();

        if (currentCardAnswerStatus === "unchecked") {
            checkAnswerCore();
        } else {
            nextCardCore();
        }
    }
}

type GeneralListPlayPropsType = {
    getInitialCards: (
        token: string,
        sentenceListID: number
    ) => Promise<CardInterface[]>;
    assumeDefaultBookmarkValue?: boolean;
};
export default function GeneralListPlay({
    getInitialCards,
    assumeDefaultBookmarkValue,
}: GeneralListPlayPropsType) {
    const params = useParams();
    const listIDParameter = params.listId !== undefined ? params.listId : "";
    const sentenceListID = parseInt(listIDParameter);
    const token = getToken();

    if (token === null) {
        return <div>Please log in first.</div>;
    }

    const initialCards = getInitialCards(token, sentenceListID);
    return (
        <GeneralListPlayCore
            token={token}
            sentenceListID={sentenceListID}
            initialCards={initialCards}
            assumeDefaultBookmarkValue={assumeDefaultBookmarkValue}
        />
    );
}
