import { areEquivalent, toWords } from "../utilities/helperFuncs";
import {
  InputStatus,
  Sentence,
  Word,
  InputPrelimStatus,
} from "../utilities/types";

export interface IQuestionInputProps {
  sentence: Sentence;
  maskedWord: Word;

  userInput: string;
  onUserInputChange: (newInput: string) => void;

  inputStatus: InputStatus;
  inputPrelimStatus: InputPrelimStatus;

  primaryAction: () => void;
}

export default function QuestionInput(props: IQuestionInputProps) {
  const words = toWords(props.sentence.text);
  const maskedWordPosition = words.findIndex((word) =>
    areEquivalent(word, props.maskedWord.word, props.sentence.textLocale)
  );
  const beforeHiddenWord = words.slice(0, maskedWordPosition).join(" ");
  const hiddenWord = words[maskedWordPosition];
  const afterHiddenWord = words.slice(maskedWordPosition + 1).join(" ");

  const inputBgColorClass =
    props.inputStatus === "correct"
      ? "bg-green-300"
      : props.inputStatus === "incorrect"
      ? "bg-red-300"
      : "";

  const inputTextColorClass = ((
    stat: InputStatus,
    prelimStat: InputPrelimStatus
  ) => {
    if (stat !== "unchecked") {
      return "";
    }

    switch (prelimStat) {
      case "correct":
        return "text-green-300";
      case "incorrect":
        return "text-red-300";
      case "partial":
        return "text-gray-300";
    }
  })(props.inputStatus, props.inputPrelimStatus);

  return (
    <div className="text-xl">
      <p>{beforeHiddenWord}</p>
      <input
        className={`p-2 text-center ${inputBgColorClass} ${inputTextColorClass}`}
        autoFocus
        value={props.inputStatus !== "unchecked" ? hiddenWord : props.userInput}
        onChange={(e) => props.onUserInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.primaryAction();
          }
        }}
      />
      <p>{afterHiddenWord}</p>
    </div>
  );
}
