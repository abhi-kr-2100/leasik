import { InputStatusType, ExtendedWordCard, InputPrelimStatusType } from "../utilities/types";
import QuestionInput from "./QuestionInput";

export interface IQuestionProps {
  extendedWordCard: ExtendedWordCard;
  inputStatus: InputStatusType;
  inputPrelimStatus: InputPrelimStatusType;
  userInput: string;
  onUserInputChange: (newInput: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  return (
    <div className="text-center">
      <QuestionInput
        extendedWordCard={props.extendedWordCard}
        userInput={props.userInput}
        inputStatus={props.inputStatus}
        inputPrelimStatus={props.inputPrelimStatus}
        onUserInputChange={props.onUserInputChange}
        primaryAction={props.primaryAction}
      />
      <p className="my-2">{props.extendedWordCard.sentence.translation}</p>
    </div>
  );
}
