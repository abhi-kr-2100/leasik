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
    selectedWordIndices: number[];
    onBookmark: () => any;
    onSelectWordIndex: (
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: () => any;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (newInput: string) => any;
    onAnswerCheck: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => any;
    onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    answerAccessKey?: string;
    bookmarkAccessKey?: string;
    editCardsAccessKey?: string;
    editSaveAccessKey?: string;
    editCancelAccessKey?: string;
}

export default function QuizDisplay({
    card,
    isEditCardsDialogOpen,
    isCardEditsBeingSaved,
    isBookmarkBeingToggled,
    selectedWordIndices,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
    onSelectWordIndex,
    answerStatus,
    currentInput,
    onEnterKeyPress,
    onInputChange,
    onAnswerCheck,
    onNext,
    answerAccessKey,
    bookmarkAccessKey,
    editCardsAccessKey,
    editSaveAccessKey,
    editCancelAccessKey,
}: IQuizDisplayProperties) {
    return (
        <div className="pt-5">
            <div className="hero-head">
                <UtilityButtons
                    bookmarkAccessKey={bookmarkAccessKey}
                    editCardsAccessKey={editCardsAccessKey}
                    editCancelAccessKey={editCancelAccessKey}
                    editSaveAccessKey={editSaveAccessKey}
                    card={card}
                    isCardEditsBeingSaved={isCardEditsBeingSaved}
                    isEditCardsDialogBoxOpen={isEditCardsDialogOpen}
                    isBookmarkBeingToggled={isBookmarkBeingToggled}
                    selectedWordIndices={selectedWordIndices}
                    onSelectWordIndex={onSelectWordIndex}
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
                    accessKey={answerAccessKey}
                    answerStatus={answerStatus}
                    onAnswerCheck={onAnswerCheck}
                    onNext={onNext}
                />
            </div>
        </div>
    );
}
