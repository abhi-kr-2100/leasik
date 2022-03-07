import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ICard } from "../../utilities/models";
import { AugmentedCard, answerStatusType } from "../../utilities/types";
import { getToken } from "../../utilities/authentication";

import {
    answerCheckAndNextAccessKey,
    bookmarkAccessKey,
    editAccessKey,
    editCancelAccessKey,
    editSaveAccessKey,
} from "../../utilities/accessKeys";

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
} from "../../utilities/apiCalls";

import LoadingScreen from "../../utilities/components/LoadingScreen";
import QuizDisplay from "../../utilities/components/QuizDisplay";
import QuizFinishScreen from "../../utilities/components/QuizFinishScreen";

interface IGeneralListPlayCoreProperties {
    token: string;
    sentenceListID: BigInt;
    initialCards: Promise<ICard[]>;
}

function GeneralListPlayCore({
    token,
    sentenceListID,
    initialCards,
}: IGeneralListPlayCoreProperties) {
    const [isLoadingCards, setIsLoadingCards] = useState(false);
    const [isEditCardsDialogBoxOpen, setIsEditCardsDialogBoxOpen] =
        useState(false);
    const [isBookmarkToggled, setIsBookmarkToggled] = useState(false);
    const [isCardDeletedOnServer, setIsCardDeletedOnServer] = useState(false);

    const [cards, setCards] = useState<AugmentedCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [currentSelectedWordIndices, setCurrentSelectedWordIndices] =
        useState<number[]>([]);
    const [currentCardAnswerStatus, setCurrentCardAnswerStatus] =
        useState<answerStatusType>("unchecked");

    useEffect(() => {
        setIsLoadingCards(true);
        initialCards
            .then(convertToConcreteCards)
            .then(convertToAugmentedCards)
            .then(setCards)
            .catch((error) => alert(`Couldn't load cards. ${error}`))
            .finally(() => setIsLoadingCards(false));

        async function convertToAugmentedCards(
            normalCards: ICard[]
        ): Promise<AugmentedCard[]> {
            return AugmentedCard.fromCards(normalCards);
        }
    }, [token, initialCards, sentenceListID]);

    if (isLoadingCards) {
        return <LoadingScreen />;
    }

    if (currentCardIndex === cards.length) {
        return <QuizFinishScreen />;
    }

    return (
        <QuizDisplay
            answerAccessKey={answerCheckAndNextAccessKey}
            bookmarkAccessKey={bookmarkAccessKey}
            editCardsAccessKey={editAccessKey}
            editCancelAccessKey={editCancelAccessKey}
            editSaveAccessKey={editSaveAccessKey}
            answerStatus={currentCardAnswerStatus}
            card={cards[currentCardIndex]}
            // the operation below occurs in the background, so the user should
            // not see any loading effects
            isCardEditsBeingSaved={false}
            isEditCardsDialogOpen={isEditCardsDialogBoxOpen}
            currentInput={userInput}
            onAnswerCheck={checkAnswer}
            // the operation below occurs in the background, so the user should
            // not see any loading effects
            isBookmarkBeingToggled={false}
            onBookmark={toggleBookmarkStatusOfCurrentCard}
            selectedWordIndices={currentSelectedWordIndices}
            onSelectWordIndex={selectNewWordIndices}
            onStartEditingCards={startEditingCards}
            onCancelEditingCards={cancelEditingCards}
            onSaveEditingCards={saveEditToCards}
            onEnterKeyPress={enterCheckAndNext}
            onInputChange={setUserInput}
            onNext={nextCard}
        />
    );

    function selectNewWordIndices(
        event: React.MouseEvent<HTMLElement>,
        newWordIndices: number[]
    ) {
        setCurrentSelectedWordIndices(newWordIndices);
    }

    function startEditingCards() {
        setIsEditCardsDialogBoxOpen(true);
    }

    function cancelEditingCards() {
        setIsEditCardsDialogBoxOpen(false);
    }

    function saveEditToCards() {
        setIsCardDeletedOnServer(currentSelectedWordIndices.length > 0);
        setIsEditCardsDialogBoxOpen(false);
    }

    async function sendSaveEditToCardsRequestToAPI(
        cardIndex: number,
        currentSelectedWordIndices: number[]
    ): Promise<void> {
        if (currentSelectedWordIndices.length === 0) {
            return;
        }

        const currentCard = cards[cardIndex];

        return replaceWithNewCards(
            token,
            currentCard.id,
            currentSelectedWordIndices
        )
            .then((sisterCards) => AugmentedCard.fromCards(sisterCards))
            .then((augmentedSisterCards) => {
                if (!currentCard.is_bookmarked) {
                    return;
                }

                return addBookmarkBulk(
                    token,
                    sentenceListID,
                    augmentedSisterCards.map(getID)
                );
            })
            .catch((error) => alert(`Couldn't update cards. ${error}`));
    }

    function toggleBookmarkStatusOfCurrentCard() {
        setIsBookmarkToggled(!isBookmarkToggled);

        const currentCard = cards[currentCardIndex];
        const currentCardUpdated = {
            ...currentCard,
            is_bookmarked: !currentCard.is_bookmarked,
        };

        const updatedCards = [
            ...cards.slice(0, currentCardIndex),
            currentCardUpdated,
            ...cards.slice(currentCardIndex + 1),
        ];

        setCards(updatedCards);
    }

    async function sendToggleBookmarkStatusRequestToAPI(
        cardIndex: number,
        isCardDeletedOnServer: boolean,
        isBookmarkToggled: boolean
    ) {
        if (isCardDeletedOnServer || !isBookmarkToggled) {
            return;
        }

        const currentCard = cards[cardIndex];

        // is_bookmarked is the state we want the card on the server to be in
        const action = currentCard.is_bookmarked
            ? addBookmarkBulk
            : removeBookmarkBulk;

        const cardsToUpdate = [currentCard];

        return action(token, sentenceListID, cardsToUpdate.map(getID)).catch(
            (error) => alert(`Couldn't toggle bookmarks. ${error}`)
        );
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
        sendSaveEditToCardsRequestToAPI(
            currentCardIndex,
            currentSelectedWordIndices
        );
        sendToggleBookmarkStatusRequestToAPI(
            currentCardIndex,
            isCardDeletedOnServer,
            isBookmarkToggled
        );

        setIsBookmarkToggled(false);
        setIsCardDeletedOnServer(false);
        setCurrentCardIndex(currentCardIndex + 1);
        setUserInput("");
        setCurrentCardAnswerStatus("unchecked");
        setCurrentSelectedWordIndices([]);
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
}
export default function GeneralListPlay({
    getInitialCards,
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
        />
    );
}
