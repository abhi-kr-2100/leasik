import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import {
  INCREASE_CARD_PROFICIENCY,
  DECREASE_CARD_PROFICIENCY,
} from "../utilities/queries";
import { matches, partitionSentence } from "../utilities/helperFuncs";

export interface ICheckInputBtnProps {
  card: Card;
  getUserInput: () => string;
  onClick: () => void;
}

export default function CheckInputBtn(props: ICheckInputBtnProps) {
  const [, hiddenWord] = partitionSentence(
    props.card.sentence.text,
    props.card.hiddenWordPosition
  );

  const [increaseCardProficiency] = useMutation(INCREASE_CARD_PROFICIENCY, {
    variables: { cardId: props.card.id },
    onError: (error) => {
      alert(`couldn't update card proficiency: ${error.message}`);
    },
  });

  const [decreaseCardProficiency] = useMutation(DECREASE_CARD_PROFICIENCY, {
    variables: { cardId: props.card.id },
    onError: (error) => {
      alert(`couldn't update card proficiency: ${error.message}`);
    },
  });

  return (
    <button
      className="my-2 px-3 py-2 bg-lime-300 rounded"
      onClick={() => {
        if (matches(hiddenWord, props.getUserInput())) {
          increaseCardProficiency();
        } else {
          decreaseCardProficiency();
        }

        props.onClick();
      }}
    >
      Check
    </button>
  );
}
