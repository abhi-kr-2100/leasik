import { answerStatusType } from "../types";

interface IAnswerButtonsProperties {
    answerStatus: answerStatusType;
    onAnswerCheck: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => any;
    onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
export default function AnswerButtons({
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
