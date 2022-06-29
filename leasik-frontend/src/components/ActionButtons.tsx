import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";

export interface IActionButtonsProps {
  card: Card;
  inputStatus: InputStatusType;
  primaryAction: () => void;
}

export default function ActionButtons(props: IActionButtonsProps) {
  return (
    <div>
      <button
        onClick={props.primaryAction}
        className="my-2 mr-2 px-3 py-2 bg-lime-300 rounded"
      >
        {props.inputStatus === "unchecked" ? "Check" : "Next"}
      </button>

      <button className="my-2 mr-2 px-3 py-2 bg-lime-300 rounded">
        {props.card.isBookmarked ? "Remove " : ""} Bookmark
      </button>
    </div>
  );
}
