import { toWords } from "../utilities/helperFuncs";
import { InputStatusType, ExtendedWordCard, InputPrelimStatusType } from "../utilities/types";

export interface IQuestionInputProps {
  extendedWordCard: ExtendedWordCard;

  userInput: string;
  onUserInputChange: (newInput: string) => void;

  inputStatus: InputStatusType;
  inputPrelimStatus: InputPrelimStatusType;

  primaryAction: () => void;
}

export default function QuestionInput(props: IQuestionInputProps) {
  const words = toWords(props.extendedWordCard.sentence.text);
  const beforeHiddenWord = words.slice(0, props.extendedWordCard.hiddenWordPosition).join(" ");
  const hiddenWord = words[props.extendedWordCard.hiddenWordPosition];
  const afterHiddenWord = words.slice(props.extendedWordCard.hiddenWordPosition + 1).join(" ");

  const inputBgColorClass =
    props.inputStatus === "correct"
      ? "bg-green-300"
      : props.inputStatus === "incorrect"
        ? "bg-red-300"
        : "";

  const inputTextColorClass = ((stat: InputStatusType, prelimStat: InputPrelimStatusType) => {
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
