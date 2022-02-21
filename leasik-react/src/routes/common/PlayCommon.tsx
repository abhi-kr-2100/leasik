import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ICard } from "../../utilities/models";
import { AugmentedCard, answerStatusType } from "../../utilities/types";
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

import LoadingScreen from "../../utilities/components/LoadingScreen";
import QuizDisplay from "../../utilities/components/QuizDisplay";

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
        return <LoadingScreen />;
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

        return Promise.all(
            cardsToUpdate.map(async (c) =>
                apiFunction(token, sentenceListID, c.id)
            )
        )
            .then(() => (currentCard.isBookmarked = !currentCard.isBookmarked))
            .then(() => setCards(cardsCopy))
            .catch((error) => alert(`Couldn't toggle bookmarks. ${error}`));
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
