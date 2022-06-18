import Card from "../models/Card";
import WordsController from "./WordsController";
import { toWords } from "../utilities/helperFuncs";
import { InputStatusType } from "../utilities/types";

export interface IQuestionProps {
  card: Card;
  inputStatus: InputStatusType;
  userInput: string;
  setUserInput: (input: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  const words = toWords(props.card.sentence.text);
  const beforeHiddenWord = words.slice(0, props.card.hiddenWordPosition);
  const hiddenWord = words[props.card.hiddenWordPosition];
  const afterHiddenWord = words.slice(props.card.hiddenWordPosition + 1);

  const inputBgColorClass =
    props.inputStatus === "correct"
      ? "bg-green-300"
      : props.inputStatus === "incorrect"
      ? "bg-red-300"
      : "";

  return (
    <div className="text-center">
      <div>
        <div className="text-xl my-3">
          <WordsController
            words={beforeHiddenWord}
            hiddenWordPositions={props.card.hiddenWordPositions}
            zeroError={0}
          />
          <input
            className={`inline mx-1 p-2 text-center ${inputBgColorClass}`}
            autoFocus
            value={
              props.inputStatus !== "unchecked" ? hiddenWord : props.userInput
            }
            onChange={(e) => props.setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.primaryAction();
              }
            }}
          />
          <WordsController
            words={afterHiddenWord}
            hiddenWordPositions={props.card.hiddenWordPositions}
            zeroError={props.card.hiddenWordPosition + 1}
          />
        </div>
      </div>
      <div>
        <p>{props.card.sentence.translation}</p>
      </div>
    </div>
  );
}
