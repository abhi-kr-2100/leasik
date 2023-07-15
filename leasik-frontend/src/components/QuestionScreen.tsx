import { Sentence, InputPrelimStatusType, InputStatusType, Word } from "../utilities/types";
import Question from "./Question";

export interface IQuestionScreenProps {
  sentence: Sentence;
  maskedWord: Word;
  primaryAction: () => void;
  inputStatus: InputStatusType;
  inputPrelimStatus: InputPrelimStatusType;
  userInput: string;
  onUserInputChange: (newInput: string) => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <Question
        sentence={props.sentence}
        maskedWord={props.maskedWord}
        inputStatus={props.inputStatus}
        inputPrelimStatus={props.inputPrelimStatus}
        userInput={props.userInput}
        onUserInputChange={props.onUserInputChange}
        primaryAction={props.primaryAction}
      />
      <button
        onClick={props.primaryAction}
        className="my-2 px-3 py-2 bg-emerald-400 rounded-sm"
      >
        {props.inputStatus === "unchecked" ? "Check" : "Next"}
      </button>
    </>
  );
}
