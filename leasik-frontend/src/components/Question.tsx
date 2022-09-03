import { InputStatusType, ExtendedWordCard } from "../utilities/types";
import QuestionInput from "./QuestionInput";

export interface IQuestionProps {
  extendedWordCard: ExtendedWordCard;
  inputStatus: InputStatusType;
  userInput: string;
  setUserInput: (input: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  return (
    <div className="text-center">
      <QuestionInput
        extendedWordCard={props.extendedWordCard}
        userInput={props.userInput}
        setUserInput={props.setUserInput}
        inputStatus={props.inputStatus}
        primaryAction={props.primaryAction}
      />
      <p>{props.extendedWordCard.sentence.translation}</p>
    </div>
  );
}
