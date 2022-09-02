import Card from "../models/Card";
import { toWords } from "../utilities/helperFuncs";
import { InputStatusType } from "../utilities/types";

export interface IQuestionInputProps {
  card: Card;

  userInput: string;
  setUserInput: (input: string) => void;

  inputStatus: InputStatusType;
  primaryAction: () => void;
}

export default function QuestionInput(props: IQuestionInputProps) {
  return (
    <div className="text-xl my-3">
      <p>props.card.sentence.text</p>
    </div>
  );
}
