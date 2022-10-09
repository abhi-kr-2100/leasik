import { ExtendedWordCard, InputPrelimStatusType, InputStatusType } from "../utilities/types";
import Question from "./Question";

export interface IQuestionScreenProps {
  extendedWordCard: ExtendedWordCard;
  primaryAction: () => void;
  inputStatus: InputStatusType;
  inputPrelimStatus: InputPrelimStatusType;
  userInput: string;
  onUserInputChange: (newInput: string) => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <div className="my-2">
        <Question
          extendedWordCard={props.extendedWordCard}
          inputStatus={props.inputStatus}
          inputPrelimStatus={props.inputPrelimStatus}
          userInput={props.userInput}
          onUserInputChange={props.onUserInputChange}
          primaryAction={props.primaryAction}
        />
      </div>
      <button
        onClick={props.primaryAction}
        className="my-2 mr-2 px-3 py-2 bg-lime-300 rounded"
      >
        {props.inputStatus === "unchecked" ? "Check" : "Next"}
      </button>
    </>
  );
}
