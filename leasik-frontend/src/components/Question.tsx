import { partitionSentence, matches } from "../utilities/helperFuncs";

export interface IQuestionProps {
  text: string;
  translation: string;
  hiddenWordPosition: number;
  checked: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
}

export default function Question(props: IQuestionProps) {
  const [beforeHiddenWord, word, afterHiddenWord] = partitionSentence(
    props.text,
    props.hiddenWordPosition
  );

  const inputBgColorClass = props.checked
    ? matches(word, props.userInput)
      ? "bg-lime-300"
      : "bg-red-600"
    : "";

  return (
    <div className="text-center">
      <div>
        <div className="text-xl my-3">
          <p className="inline">{beforeHiddenWord}</p>
          <input
            className={`inline mx-1 p-2 text-center ${inputBgColorClass}`}
            autoFocus
            value={props.checked ? word : props.userInput}
            disabled={props.checked}
            onChange={(newValue) => props.setUserInput(newValue.target.value)}
          />
          <p className="inline">{afterHiddenWord}</p>
        </div>
      </div>
      <div>
        <p>{props.translation}</p>
      </div>
    </div>
  );
}
