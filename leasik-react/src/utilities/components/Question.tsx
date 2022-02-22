import React from "react";
import { AugmentedCard, answerStatusType } from "../types";
import { getWords } from "../utilFunctions";

interface IQuestionProperties {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onInputChange: (newInput: string) => any;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
}

export default function Question({
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
