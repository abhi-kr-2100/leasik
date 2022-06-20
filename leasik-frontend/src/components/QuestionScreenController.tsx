import { useState } from "react";
import { useMutation } from "@apollo/client";

import Card from "../models/Card";
import QuestionScreen from "./QuestionScreen";
import { InputStatusType } from "../utilities/types";
import { SCORE_ANSWER } from "../utilities/queries";
import { matches, toWords } from "../utilities/helperFuncs";

export interface IQuestionScreenControllerProps {
  card: Card;
  onNext: () => void;
}

export default function QuestionScreenController(
  props: IQuestionScreenControllerProps
) {
  const [userInput, setUserInput] = useState("");
  const [inputStatus, setInputStatus] = useState<InputStatusType>("unchecked");

  const [scoreAnswer] = useMutation(SCORE_ANSWER, {
    onError: (error) => {
      alert(`could not score answer: ${error}`);
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
        setInputStatus("correct");
        scoreAnswer({ variables: { cardId: props.card.id, score: 5 } });
      } else {
        setInputStatus("incorrect");
        scoreAnswer({ variables: { cardId: props.card.id, score: 0 } });
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
