import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import {
  INCREASE_CARD_PROFICIENCY,
  DECREASE_CARD_PROFICIENCY,
} from "../utilities/queries";
import { matches, toWords } from "../utilities/helperFuncs";

export interface ICheckInputBtnProps {
  card: Card;
  userInput: string;
  setIsInputChecked: (checked: boolean) => void;
}

export default function CheckInputBtn(props: ICheckInputBtnProps) {
  const words = toWords(props.card.sentence.text);
  const hiddenWord = words[props.card.hiddenWordPosition];

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
        if (matches(hiddenWord, props.userInput)) {
          increaseCardProficiency();
        } else {
          decreaseCardProficiency();
        }

        props.setIsInputChecked(true);
      }}
    >
      Check
    </button>
  );
}
