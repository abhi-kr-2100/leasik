import { answerStatusType } from "../types";

interface IAnswerButtonsProperties {
    answerStatus: answerStatusType;
    onAnswerCheck: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => any;
    onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    accessKey?: string;
}

export default function AnswerButtons({
    answerStatus,
    onAnswerCheck,
    onNext,
    accessKey,
}: IAnswerButtonsProperties) {
    const isAnswerUnchcked = answerStatus === "unchecked";

    const submitFunction = isAnswerUnchcked ? onAnswerCheck : onNext;
    const buttonText = isAnswerUnchcked ? "Check" : "Next";

    return (
        <div className="container has-text-centered block">
            <button
                accessKey={accessKey}
                className="button is-primary"
                onClick={submitFunction}
            >
                {buttonText}
            </button>
        </div>
    );
}
