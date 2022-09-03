import { ExtendedWordCard } from "../utilities/types";
import Question from "./Question";

export interface IQuestionScreenProps {
  extendedWordCard: ExtendedWordCard;
  primaryAction: () => void;
  inputStatus: "unchecked" | "correct" | "incorrect";
  userInput: string;
  setUserInput: (input: string) => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <div className="my-2">
        <Question
          extendedWordCard={props.extendedWordCard}
          inputStatus={props.inputStatus}
          userInput={props.userInput}
          setUserInput={props.setUserInput}
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
