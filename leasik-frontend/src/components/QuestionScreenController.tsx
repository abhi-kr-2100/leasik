import { useState } from "react";
import { useMutation } from "@apollo/client";

import { matches, toWords } from "../utilities/helperFuncs";
import {
  INCREASE_CARD_PROFICIENCY,
  DECREASE_CARD_PROFICIENCY,
} from "../utilities/queries";

import Card from "../models/Card";
import QuestionScreen from "./QuestionScreen";
import { InputStatusType } from "../utilities/types";

export interface IQuestionScreenControllerProps {
  card: Card;
  onNext: () => void;
}

export default function QuestionScreenController(
  props: IQuestionScreenControllerProps
) {
  const [userInput, setUserInput] = useState("");
  const [inputStatus, setInputStatus] = useState<InputStatusType>("unchecked");

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

  const primaryAction = () => {
    if (inputStatus !== "unchecked") {
      setUserInput("");
      setInputStatus("unchecked");
      props.onNext();
    } else {
      const words = toWords(props.card.sentence.text);
      const hiddenWord = words[props.card.hiddenWordPosition];

      if (matches(userInput, hiddenWord)) {
        increaseCardProficiency();
        setInputStatus("correct");
      } else {
        decreaseCardProficiency();
        setInputStatus("incorrect");
      }
    }
  };

  return (
    <QuestionScreen
      card={props.card}
      primaryAction={primaryAction}
      inputStatus={inputStatus}
      userInput={userInput}
      setUserInput={setUserInput}
    />
  );
}
