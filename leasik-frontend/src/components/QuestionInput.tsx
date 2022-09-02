import WordCard from "../models/WordCard";
import { findWordPositions, randomChoice, toWords } from "../utilities/helperFuncs";
import { InputStatusType } from "../utilities/types";

export interface IQuestionInputProps {
  wordCard: WordCard;

  userInput: string;
  setUserInput: (input: string) => void;

  inputStatus: InputStatusType;
  primaryAction: () => void;
}

export default function QuestionInput(props: IQuestionInputProps) {
  const words = toWords(props.wordCard.sentence.text);
  const hiddenWordPosition = randomChoice(findWordPositions(words, props.wordCard.word));
  const beforeHiddenWord = words.slice(0, hiddenWordPosition).join(" ");
  const hiddenWord = words[hiddenWordPosition];
  const afterHiddenWord = words.slice(hiddenWordPosition + 1).join(" ");

  const inputBgColorClass =
    props.inputStatus === "correct"
      ? "bg-green-300"
      : props.inputStatus === "incorrect"
        ? "bg-red-300"
        : "";

  return (
    <div className="text-xl my-3">
      <p className="inline">{beforeHiddenWord}</p>
      <input
        className={`inline mx-1 p-2 text-center ${inputBgColorClass}`}
        autoFocus
        value={props.inputStatus !== "unchecked" ? hiddenWord : props.userInput}
        onChange={(e) => props.setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.primaryAction();
          }
        }}
      />
      <p className="inline">{afterHiddenWord}</p>
    </div>
  );
}
