import { InputStatusType } from "../utilities/types";

export interface IActionButtonsProps {
  inputStatus: InputStatusType;
  primaryAction: () => void;
}

export default function ActionButtons(props: IActionButtonsProps) {
  return (
    <button
      onClick={props.primaryAction}
      className="my-2 px-3 py-2 bg-lime-300 rounded"
    >
      {props.inputStatus === "unchecked" ? "Check" : "Next"}
    </button>
  );
}
