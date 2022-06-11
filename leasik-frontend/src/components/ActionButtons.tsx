import Card from "../models/Card";
import CheckInputBtn from "./CheckInputBtn";

export interface IActionButtonsProps {
  card: Card;

  isInputChecked: boolean;
  setIsInputChecked: (checked: boolean) => void;

  userInput: string;
  setUserInput: (input: string) => void;

  onNext: () => void;
}

export default function ActionButtons(props: IActionButtonsProps) {
  if (props.isInputChecked) {
    return (
      <button
        onClick={() => {
          props.setUserInput("");
          props.setIsInputChecked(false);
          props.onNext();
        }}
        className="my-2 px-3 py-2 bg-lime-300 rounded"
      >
        Next
      </button>
    );
  }

  return (
    <CheckInputBtn
      card={props.card}
      userInput={props.userInput}
      setIsInputChecked={props.setIsInputChecked}
    />
  );
}
