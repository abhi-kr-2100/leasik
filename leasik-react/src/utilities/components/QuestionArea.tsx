import React from "react";
import { AugmentedCard, answerStatusType } from "../types";
import Question from "./Question";
import QuestionHint from "./QuestionHint";

interface IQuestionAreaProperties {
    card: AugmentedCard;
    answerStatus: answerStatusType;
    currentInput: string;
    onEnterKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => any;
    onInputChange: (newInput: string) => any;
}

export default function QuestionArea({
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
