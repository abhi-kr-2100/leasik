import { useState } from "react";

import { matches, toWords } from "../utilities/helperFuncs";

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
      } else {
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
