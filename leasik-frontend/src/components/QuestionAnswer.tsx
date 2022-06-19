import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";
import WordsController from "./WordsController";

export interface IQuestionAnswerProps {
  card: Card;
  inputStatus: InputStatusType;
}

export default function QuestionAnswer(props: IQuestionAnswerProps) {
  return <WordsController card={props.card} inputStatus={props.inputStatus} />;
}
