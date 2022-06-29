import { useMutation } from "@apollo/client";
import { useState } from "react";

import Card from "../models/Card";
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from "../utilities/queries";
import { InputStatusType } from "../utilities/types";

export interface IActionButtonsProps {
  card: Card;
  inputStatus: InputStatusType;
  primaryAction: () => void;
}

export default function ActionButtons(props: IActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(props.card.isBookmarked);

  const [toggleBookmarkStatus] = useMutation(
    props.card.isBookmarked ? REMOVE_BOOKMARK : ADD_BOOKMARK,
    {
      variables: { cardId: props.card.id },
      onCompleted: () => {
        setIsBookmarked(!isBookmarked);
      },
      onError: (error) => {
        alert(`bookmark toggling failed: ${error.message}`);
      },
    }
  );

  return (
    <div>
      <button
        onClick={props.primaryAction}
        className="my-2 mr-2 px-3 py-2 bg-lime-300 rounded"
      >
        {props.inputStatus === "unchecked" ? "Check" : "Next"}
      </button>

      <button
        className="my-2 mr-2 px-3 py-2 bg-lime-300 rounded"
        onClick={() => toggleBookmarkStatus()}
      >
        {isBookmarked ? "Remove " : ""} Bookmark
      </button>
    </div>
  );
}
