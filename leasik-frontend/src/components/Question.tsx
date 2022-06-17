import Card from "../models/Card";
import { partitionSentence } from "../utilities/helperFuncs";
import { InputStatusType } from "../utilities/types";

export interface IQuestionProps {
  card: Card;
  inputStatus: InputStatusType;
  userInput: string;
  setUserInput: (input: string) => void;
  primaryAction: () => void;
}

export default function Question(props: IQuestionProps) {
  const [beforeHiddenWord, word, afterHiddenWord] = partitionSentence(
    props.card.sentence.text,
    props.card.hiddenWordPosition
  );

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
          <p className="inline">{beforeHiddenWord}</p>
          <input
            className={`inline mx-1 p-2 text-center ${inputBgColorClass}`}
            autoFocus
            value={props.inputStatus !== "unchecked" ? word : props.userInput}
            onChange={(e) => props.setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.primaryAction();
              }
            }}
          />
          <p className="inline">{afterHiddenWord}</p>
        </div>
      </div>
      <div>
        <p>{props.card.sentence.translation}</p>
      </div>
    </div>
  );
}
