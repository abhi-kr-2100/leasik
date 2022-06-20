import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";
import WordsController from "./WordsController";
import QuestionInput from "./QuestionInput";

export interface IQuestionProps {
  card: Card;
  inputStatus: InputStatusType;
  userInput: string;
  setUserInput: (input: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  return (
    <div className="text-center">
      <QuestionInput
        card={props.card}
        userInput={props.userInput}
        setUserInput={props.setUserInput}
        inputStatus={props.inputStatus}
        primaryAction={props.primaryAction}
      />
      <WordsController card={props.card} inputStatus={props.inputStatus} />
      <p>{props.card.sentence.translation}</p>
    </div>
  );
}
