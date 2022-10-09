import { useState } from "react";
import { useMutation } from "@apollo/client";

import { ExtendedWordCard, InputPrelimStatusType } from "../utilities/types";
import QuestionScreen from "./QuestionScreen";
import { InputStatusType } from "../utilities/types";
import { SCORE_ANSWER } from "../utilities/queries";
import { matches } from "../utilities/helperFuncs";

export interface IQuestionScreenControllerProps {
  extendedWordCard: ExtendedWordCard;
  onNext: () => void;
}

export default function QuestionScreenController(
  props: IQuestionScreenControllerProps
) {
  const [userInput, setUserInput] = useState("");
  const [inputStatus, setInputStatus] = useState<InputStatusType>("unchecked");
  const [inputPrelimStatus, setInputPrelimStatus] = useState<InputPrelimStatusType>("incorrect");

  const [scoreAnswer] = useMutation(SCORE_ANSWER, {
    onError: (error) => {
      alert(`could not score answer: ${error}`);
    },
  });

  const primaryAction = () => {
    const correctAnswer = props.extendedWordCard.word;
    const locale = props.extendedWordCard.sentence.textLocale;
    const cardId = props.extendedWordCard.id;

    if (inputStatus !== "unchecked") {
      setUserInput("");
      setInputStatus("unchecked");
      speechSynthesis.cancel();
      props.onNext();
    } else {
      if (matches(userInput, correctAnswer, locale)) {
        setInputStatus("correct");
        scoreAnswer({ variables: { cardId: cardId, score: 5 } });
      } else {
        setInputStatus("incorrect");
        scoreAnswer({ variables: { cardId: cardId, score: 0 } });
      }

      if (props.extendedWordCard.sentence.textLanguage !== "") {
        let utterence = new SpeechSynthesisUtterance();
        utterence.text = props.extendedWordCard.sentence.text;
        utterence.lang = props.extendedWordCard.sentence.textLanguage;
        utterence.rate = 0.9;

        speechSynthesis.speak(utterence);
      }
    }
  };

  const onUserInputChange = (newInput: string) => {
    if (inputStatus !== "unchecked") {
      // inputPrelimStatus is only meaningful for unchecked inputs
      // if input is not unchecked, i.e., it's been submitted by the user,
      // inputStatus should be used, not inputPrelimStatus
      return;
    }

    const correctAnswer = props.extendedWordCard.word;
    const locale = props.extendedWordCard.sentence.textLocale;

    setUserInput(newInput);
    setInputPrelimStatus(
      matches(newInput, correctAnswer, locale) ? "correct" : "incorrect"
    )
  }

  return (
    <QuestionScreen
      extendedWordCard={props.extendedWordCard}
      primaryAction={primaryAction}
      inputStatus={inputStatus}
      inputPrelimStatus={inputPrelimStatus}
      userInput={userInput}
      onUserInputChange={onUserInputChange}
    />
  );
}
