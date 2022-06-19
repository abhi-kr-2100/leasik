import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";

export interface IQuestionAnswerProps {
  card: Card;
  inputStatus: InputStatusType;
}

export default function QuestionAnswer(props: IQuestionAnswerProps) {
  return (
    <p
      className={`my-3 ${
        props.inputStatus === "unchecked" ? "text-transparent" : ""
      }`}
    >
      {props.card.sentence.text}
    </p>
  );
}
