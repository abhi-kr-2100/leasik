import { useState } from "react";
import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";
import Word from "./Word";

export interface IWordControllerProps {
  card: Card;
  inputStatus: InputStatusType;
  word: string;
  wordPosition: number;
  isHidden: boolean;
}

export default function WordController(props: IWordControllerProps) {
  const [isHighlighted, setIsHighlighted] = useState(props.isHidden);

  const toggleStatus = () => {
    if (props.inputStatus === "unchecked") {
      return;
    }
  };

  return (
    <Word
      word={props.word}
      isHighlighted={isHighlighted && props.inputStatus !== "unchecked"}
      onClick={() => toggleStatus()}
    />
  );
}
