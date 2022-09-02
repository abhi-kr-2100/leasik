import WordCard from "../models/WordCard";
import { InputStatusType } from "../utilities/types";
import QuestionInput from "./QuestionInput";

export interface IQuestionProps {
  wordCard: WordCard;
  inputStatus: InputStatusType;
  userInput: string;
  setUserInput: (input: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  return (
    <div className="text-center">
      <QuestionInput
        wordCard={props.wordCard}
        userInput={props.userInput}
        setUserInput={props.setUserInput}
        inputStatus={props.inputStatus}
        primaryAction={props.primaryAction}
      />
      <p>{props.wordCard.sentence.translation}</p>
    </div>
  );
}
