import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import { SCORE_ANSWER } from "../utilities/queries";
import { matches, toWords } from "../utilities/helperFuncs";

export interface ICheckInputBtnProps {
  card: Card;
  userInput: string;
  setIsInputChecked: (checked: boolean) => void;
}

export default function CheckInputBtn(props: ICheckInputBtnProps) {
  const words = toWords(props.card.sentence.text);
  const hiddenWord = words[props.card.hiddenWordPosition];

  const [scoreAnswer] = useMutation(SCORE_ANSWER, {
    onError: (error) => {
      alert(`could not score answer: ${error}`);
    },
  });

  return (
    <button
      className="my-2 px-3 py-2 bg-lime-300 rounded"
      onClick={() => {
        if (matches(hiddenWord, props.userInput)) {
          scoreAnswer({ variables: { cardId: props.card.id, score: 5 } });
        } else {
          scoreAnswer({ variables: { cardId: props.card.id, score: 0 } });
        }

        props.setIsInputChecked(true);
      }}
    >
      Check
    </button>
  );
}
