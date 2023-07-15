import {
  InputStatusType,
  Sentence,
  Word,
  InputPrelimStatusType,
} from "../utilities/types";
import QuestionInput from "./QuestionInput";

export interface IQuestionProps {
  sentence: Sentence;
  maskedWord: Word;
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
        sentence={props.sentence}
        maskedWord={props.maskedWord}
        userInput={props.userInput}
        inputStatus={props.inputStatus}
        inputPrelimStatus={props.inputPrelimStatus}
        onUserInputChange={props.onUserInputChange}
        primaryAction={props.primaryAction}
      />
      <p className="my-2">{props.sentence.translation}</p>
    </div>
  );
}
