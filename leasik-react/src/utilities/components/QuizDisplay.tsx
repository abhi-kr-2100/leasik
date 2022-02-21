import React from "react";

import { ICard } from "../models";
import { AugmentedCard, answerStatusType } from "../types";

import { getWords } from "../utilFunctions";

import UtilityButtons from "./UtilityButtons";
import AnswerButtons from "./AnswerButtons";

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
    onBookmark: (
        setIsBookmarkBeingToggled: (isBookmarkBeingToggled: boolean) => any
    ) => any;
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
