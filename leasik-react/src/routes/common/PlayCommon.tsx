import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ICard } from "../../utilities/models";
import { AugmentedCard, answerStatusType } from "../../utilities/types";
import { getToken } from "../../utilities/authentication";

import {
    getWords,
    getID,
    semanticallyEqual,
    convertToConcreteCards,
} from "../../utilities/utilFunctions";

import {
    addBookmarkBulk,
    removeBookmarkBulk,
    updateProficiency,
    replaceWithNewCards,
    isBookmarkedBulk,
} from "../../utilities/apiCalls";

import LoadingScreen from "../../utilities/components/LoadingScreen";
import QuizDisplay from "../../utilities/components/QuizDisplay";
import QuizFinishScreen from "../../utilities/components/QuizFinishScreen";

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
    const [isBookmarkBeingToggled, setIsBookmarkBeingToggled] =
        useState(false);
    const [isEditCardsDialogBoxOpen, setIsEditCardsDialogBoxOpen] =
        useState(false);
    const [isCardEditsBeingSaved, setIsCardEditsBeingSaved] = useState(false);

    const [cards, setCards] = useState<AugmentedCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [currentCardAnswerStatus, setCurrentCardAnswerStatus] =
        useState<answerStatusType>("unchecked");

    useEffect(() => {
        setIsLoading(true);
        initialCards
            .then(convertToConcreteCards)
            .then(convertToAugmentedCards)
            .then(setCards)
            .catch((error) => alert(`Couldn't load cards. ${error}`))
            .finally(() => setIsLoading(false));

        async function convertToAugmentedCards(
            normalCards: ICard[]
        ): Promise<AugmentedCard[]> {
            if (assumeDefaultBookmarkValue) {
                return AugmentedCard.fromCardsWithOneBookmarkValue(
                    normalCards,
                    assumeDefaultBookmarkValue
                );
            }

            const cardIDs = normalCards.map(getID);
            const bookmarkStatuses = await isBookmarkedBulk(
                token,
                sentenceListID,
                cardIDs
            );

            return AugmentedCard.fromCards(normalCards, bookmarkStatuses);
        }
    }, [token, initialCards, sentenceListID, assumeDefaultBookmarkValue]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (currentCardIndex === cards.length) {
        return <QuizFinishScreen />;
    }

    return (
        <QuizDisplay
            answerStatus={currentCardAnswerStatus}
            card={cards[currentCardIndex]}
            isCardEditsBeingSaved={isCardEditsBeingSaved}
            isEditCardsDialogOpen={isEditCardsDialogBoxOpen}
            currentInput={userInput}
            onAnswerCheck={checkAnswer}
            isBookmarkBeingToggled={isBookmarkBeingToggled}
            onBookmark={toggleBookmarkStatusOfCurrentCard}
            onStartEditingCards={startEditingCards}
            onCancelEditingCards={cancelEditingCards}
            onSaveEditingCards={saveEditToCards}
            onEnterKeyPress={enterCheckAndNext}
            onInputChange={setUserInput}
            onNext={nextCard}
        />
    );

    function startEditingCards() {
        if (isBookmarkBeingToggled) {
            // one thing at a time
            return;
        }

        setIsEditCardsDialogBoxOpen(true);
    }

    function cancelEditingCards() {
        if (isCardEditsBeingSaved) {
            // wait for save to finish
            return;
        }

        setIsEditCardsDialogBoxOpen(false);
    }

    async function saveEditToCards(newWordIndices: number[]): Promise<void> {
        if (newWordIndices.length === 0) {
            return;
        }

        const currentCard = cards[currentCardIndex];
        const currentCardUpdated = { ...currentCard, isDeletedOnServer: true };

        // same as cards except that the current card is the updated one
        const cardsCopyWithUpdatedCurrentCard = [
            ...cards.slice(0, currentCardIndex),
            currentCardUpdated,
            ...cards.slice(currentCardIndex + 1),
        ];

        // any card that we know is not deleted on the server
        const availableCard = currentCard.isDeletedOnServer
            ? currentCard.sisterCards[0]
            : currentCard;

        setIsCardEditsBeingSaved(true);
        return replaceWithNewCards(token, availableCard.id, newWordIndices)
            .then((sisterCards) =>
                AugmentedCard.fromCardsWithOneBookmarkValue(
                    sisterCards,
                    currentCardUpdated.isBookmarked
                )
            )
            .then(setSisterCards)
            .then((augmentedSisterCards) => {
                if (!currentCardUpdated.isBookmarked) {
                    return;
                }

                return addBookmarkBulk(
                    token,
                    sentenceListID,
                    augmentedSisterCards.map(getID)
                );
            })
            .then(() => setCards(cardsCopyWithUpdatedCurrentCard))
            .catch((error) => alert(`Couldn't update cards. ${error}`))
            .finally(() => {
                setIsCardEditsBeingSaved(false);
                setIsEditCardsDialogBoxOpen(false);
            });

        function setSisterCards(sisterCards: AugmentedCard[]) {
            return (cardsCopyWithUpdatedCurrentCard[
                currentCardIndex
            ].sisterCards = sisterCards);
        }
    }

    async function toggleBookmarkStatusOfCurrentCard() {
        const cardsCopy = [...cards];
        const currentCard = cardsCopy[currentCardIndex];

        const action = currentCard.isBookmarked
            ? removeBookmarkBulk
            : addBookmarkBulk;

        const cardsToUpdate = currentCard.isDeletedOnServer
            ? currentCard.sisterCards
            : [currentCard];

        setIsBookmarkBeingToggled(true);
        return action(token, sentenceListID, cardsToUpdate.map(getID))
            .then(() => (currentCard.isBookmarked = !currentCard.isBookmarked))
            .then(() => setCards(cardsCopy))
            .catch((error) => alert(`Couldn't toggle bookmarks. ${error}`))
            .finally(() => setIsBookmarkBeingToggled(false));
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
        if (isBookmarkBeingToggled) {
            return;
        }

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
    const isParameterAvailable = parameters.listId !== undefined;

    // make sure listIDParameter is always a string
    const listIDParameter = isParameterAvailable ? parameters.listId : "";

    // as string clause is needed because TypeScript is not smart enough to
    // figure out that listIDParameter is never undefined
    const sentenceListID = BigInt(listIDParameter as string);
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
