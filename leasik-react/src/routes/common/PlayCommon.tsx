import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Dialog, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { ICard, ISentence } from "../../utilities/models";
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

interface IAugmentedCard extends ICard {
    isBookmarked: boolean;
    isDeletedOnServer: boolean;

    // sister cards are have the same sentence but different ids
    // other properties may or not differ
    sisterCards: AugmentedCard[];
}

class AugmentedCard implements IAugmentedCard {
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

type answerStatusType = "unchecked" | "correct" | "incorrect";

interface IBookmarkButtonProperties {
    card: AugmentedCard;
    onBookmark: () => any;
}
function BookmarkButton({ card, onBookmark }: IBookmarkButtonProperties) {
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

interface IEditCardsButtonProperties {
    card: ICard;
    onStartEditingCards: () => any;
    onSaveEdits: (wordIndicesToSave: number[]) => any;
    onCancelEdits: () => any;
}
function EditCardsButton({
    card,
    onStartEditingCards,
    onSaveEdits,
    onCancelEdits,
}: IEditCardsButtonProperties) {
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

interface IEditCardsDialogBoxProperties {
    card: ICard;
    open: boolean;
    onClose: () => any;
    onCancel: () => any;
    onSave: (wordIndicesToSave: number[]) => any;
}
function EditCardsDialogBox({
    card,
    open,
    onClose,
    onCancel,
    onSave,
}: IEditCardsDialogBoxProperties) {
    const words = getWords(card.sentence.text);
    const wordSelectButtons = words.map((w, index) => (
        <ToggleButton value={index} key={index}>
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
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) {
        setSelectedWordIndices(newSelectedWordIndices);
    }

    function saveSelectedWordIndices() {
        return onSave(selectedWordIndices);
    }
}

interface IUtilityButtonsProperties {
    card: AugmentedCard;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
}
function UtilityButtons({
    card,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
}: IUtilityButtonsProperties) {
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

interface IAnswerButtonsProperties {
    answerStatus: answerStatusType;
    onAnswerCheck: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => any;
    onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
function AnswerButtons({
    answerStatus,
    onAnswerCheck,
    onNext,
}: IAnswerButtonsProperties) {
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

interface IQuestionProperties {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onInputChange: (newInput: string) => any;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
}
function Question({
    card,
    answerStatus,
    currentInput,
    onInputChange,
    onEnterKeyPress,
}: IQuestionProperties) {
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

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            return onEnterKeyPress(event);
        }
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        return onInputChange(event.target.value);
    }
}

interface IQuestionHintProperties {
    card: ICard;
}
function QuestionHint({ card }: IQuestionHintProperties) {
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

interface IQuestionAreaProperties {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (newInput: string) => any;
}
function QuestionArea({
    card,
    answerStatus,
    currentInput,
    onEnterKeyPress,
    onInputChange,
}: IQuestionAreaProperties) {
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

interface IQuizDisplayProperties {
    card: AugmentedCard;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (newInput: string) => any;
    onAnswerCheck: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => any;
    onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
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
}: IQuizDisplayProperties) {
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

interface IGeneralListPlayCoreProperties {
    token: string;
    sentenceListID: BigInt;
    initialCards: Promise<ICard[]>;
    assumeDefaultBookmarkValue?: boolean;
}
function GeneralListPlayCore({
    token,
    sentenceListID,
    initialCards,
    assumeDefaultBookmarkValue,
}: IGeneralListPlayCoreProperties) {
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
            .catch((error) => alert(`Couldn't load cards. ${error}`))
            .finally(() => setIsLoading(false));

        async function toAugmentedCard(
            normalCard: ICard
        ): Promise<AugmentedCard> {
            if (assumeDefaultBookmarkValue) {
                return AugmentedCard.fromCard(
                    normalCard,
                    assumeDefaultBookmarkValue
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

    async function saveEditToCards(
        wordIndicesToSave: number[]
    ): Promise<void> {
        if (wordIndicesToSave.length === 0) {
            return;
        }

        const currentCard = cards[currentCardIndex];
        const currentCardUpdated = { ...currentCard, isDeletedOnServer: true };
        const cardsCopyWithUpdatedCurrentCard = [
            ...cards.slice(0, currentCardIndex),
            currentCardUpdated,
            ...cards.slice(currentCardIndex + 1),
        ];

        const cardsToReplace = currentCard.isDeletedOnServer
            ? currentCard.sisterCards
            : [currentCard];
        const cardsExceptLastCard = cardsToReplace.slice(0, -1);
        const lastCard = cardsToReplace[cardsToReplace.length - 1];

        return Promise.all(
            cardsExceptLastCard.map((c) =>
                replaceWithNewCards(token, c.id, [])
            )
        )
            .then(() =>
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
            .then(() => setCards(cardsCopyWithUpdatedCurrentCard))
            .catch((error) => alert(`Couldn't update cards. ${error}`));

        function setSisterCards(sisterCards: AugmentedCard[]) {
            return (cardsCopyWithUpdatedCurrentCard[
                currentCardIndex
            ].sisterCards = sisterCards);
        }
    }

    async function toggleBookmarkStatusOfCurrentCard() {
        const cardsCopy = [...cards];
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
            } catch (error) {
                return alert(`Couldn't toggle bookmark. ${error}`);
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
            updateProficiency(token, cardToCheck.id, score).catch((error) =>
                alert(`Couldn't update card proficiency. ${error}`)
            );
        }

        function hasSameHiddenWordPosition(
            sisterCard: AugmentedCard
        ): boolean {
            return (
                currentCard.hidden_word_position ===
                sisterCard.hidden_word_position
            );
        }
    }

    function checkAnswer(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        event.preventDefault();
        checkAnswerCore();
    }

    function nextCardCore() {
        setCurrentCardIndex(currentCardIndex + 1);
        setUserInput("");
        setCurrentCardAnswerStatus("unchecked");
    }

    function nextCard(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        nextCardCore();
    }

    function enterCheckAndNext(event: React.KeyboardEvent<HTMLInputElement>) {
        event.preventDefault();

        if (currentCardAnswerStatus === "unchecked") {
            checkAnswerCore();
        } else {
            nextCardCore();
        }
    }
}

interface IGeneralListPlayProperties {
    getInitialCards: (
        token: string,
        sentenceListID: BigInt
    ) => Promise<ICard[]>;
    assumeDefaultBookmarkValue?: boolean;
}
export default function GeneralListPlay({
    getInitialCards,
    assumeDefaultBookmarkValue,
}: IGeneralListPlayProperties) {
    const parameters = useParams();
    const listIDParameter =
        parameters.listId !== undefined ? parameters.listId : "";
    const sentenceListID = BigInt(listIDParameter);
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
