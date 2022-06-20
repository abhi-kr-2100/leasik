import { useState } from "react";
import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import { InputStatusType } from "../utilities/types";
import { ADD_CARD, REMOVE_CARD } from "../utilities/queries";
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

  const [addCard] = useMutation(ADD_CARD, {
    variables: {
      sentenceId: props.card.sentence.id,
      hiddenWordPosition: props.wordPosition,
    },
    onCompleted: (data) => {
      setIsHighlighted(true);
    },
    onError: (error) => {
      alert(
        `couldn't add card with hidden word position ${props.wordPosition}: ${error.message}`
      );
    },
  });

  const [removeCard] = useMutation(REMOVE_CARD, {
    variables: {
      sentenceId: props.card.sentence.id,
      hiddenWordPosition: props.wordPosition,
    },
    onCompleted: (data) => {
      setIsHighlighted(false);
    },
    onError: (error) => {
      alert(
        `couldn't remove card with hidden word position ${props.wordPosition}: ${error.message}`
      );
    },
  });

  const toggleStatus = () => {
    if (props.inputStatus === "unchecked") {
      return;
    }

    if (isHighlighted) {
      removeCard();
    } else {
      addCard();
    }
  };

  return (
    <Word
      word={props.word}
      isHighlighted={isHighlighted}
      onClick={toggleStatus}
    />
  );
}
