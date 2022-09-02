import { useState } from "react";
import { useMutation } from "@apollo/client";

import WordCard from "../models/WordCard";
import QuestionScreen from "./QuestionScreen";
import { InputStatusType } from "../utilities/types";
import { SCORE_ANSWER } from "../utilities/queries";
import { matches } from "../utilities/helperFuncs";

export interface IQuestionScreenControllerProps {
  wordCard: WordCard;
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
      if (matches(userInput, props.wordCard.word)) {
        setInputStatus("correct");
        scoreAnswer({ variables: { cardId: props.wordCard.id, score: 5 } });
      } else {
        setInputStatus("incorrect");
        scoreAnswer({ variables: { cardId: props.wordCard.id, score: 0 } });
      }
    }
  };

  return (
    <QuestionScreen
      wordCard={props.wordCard}
      primaryAction={primaryAction}
      inputStatus={inputStatus}
      userInput={userInput}
      setUserInput={setUserInput}
    />
  );
}
