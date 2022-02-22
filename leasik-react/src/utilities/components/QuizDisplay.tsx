import React from "react";

import { AugmentedCard, answerStatusType } from "../types";

import UtilityButtons from "./UtilityButtons";
import AnswerButtons from "./AnswerButtons";
import QuestionArea from "./QuestionArea";

interface IQuizDisplayProperties {
    card: AugmentedCard;
    isEditCardsDialogOpen: boolean;
    isCardEditsBeingSaved: boolean;
    isBookmarkBeingToggled: boolean;
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

export default function QuizDisplay({
    card,
    isEditCardsDialogOpen,
    isCardEditsBeingSaved,
    isBookmarkBeingToggled,
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
                    isCardEditsBeingSaved={isCardEditsBeingSaved}
                    isEditCardsDialogBoxOpen={isEditCardsDialogOpen}
                    isBookmarkBeingToggled={isBookmarkBeingToggled}
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
