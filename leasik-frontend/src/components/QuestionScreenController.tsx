import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { Sentence, InputPrelimStatus, Word } from "../utilities/types";
import { InputStatus } from "../utilities/types";
import { SCORE_ANSWER } from "../utilities/queries";
import {
  areEquivalent,
  startsWith,
  chooseMaskedWord,
} from "../utilities/helperFuncs";
import QuestionScreen from "./QuestionScreen";

export interface IQuestionScreenControllerProps {
  sentence: Sentence;
  onNext: () => void;
}

export default function QuestionScreenController(
  props: IQuestionScreenControllerProps
) {
  const [userInput, setUserInput] = useState("");
  const [inputStatus, setInputStatus] = useState<InputStatus>("unchecked");
  const [inputPrelimStatus, setInputPrelimStatus] =
    useState<InputPrelimStatus>("partial");

  const [scoreAnswer] = useMutation(SCORE_ANSWER, {
    onError: (error) => {
      alert(`could not score answer: ${error}`);
    },
  });

  const [maskedWord, setMaskedWord] = useState<Word>();
  useEffect(() => {
    setMaskedWord(chooseMaskedWord(props.sentence));
  }, [props.sentence]);

  if (maskedWord === undefined) {
    return null;
  }

  const locale = props.sentence.textLocale;

  const primaryAction = () => {
    if (inputStatus !== "unchecked") {
      setUserInput("");
      setInputStatus("unchecked");
      speechSynthesis.cancel();
      props.onNext();
    } else {
      if (areEquivalent(userInput, maskedWord.word, locale)) {
        setInputStatus("correct");
        scoreAnswer({ variables: { wordId: maskedWord.id, score: 5 } });
      } else {
        setInputStatus("incorrect");
        scoreAnswer({ variables: { wordId: maskedWord.id, score: 0 } });
      }

      if (props.sentence.textLanguage !== "") {
        let utterence = new SpeechSynthesisUtterance();
        utterence.text = props.sentence.text;
        utterence.lang = props.sentence.textLanguage;
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

    const correctAnswer = maskedWord.word;

    setUserInput(newInput);
    setInputPrelimStatus(
      startsWith(newInput, correctAnswer, locale)
        ? areEquivalent(newInput, correctAnswer, locale)
          ? "correct"
          : "partial"
        : "incorrect"
    );
  };

  return (
    <QuestionScreen
      sentence={props.sentence}
      maskedWord={maskedWord}
      primaryAction={primaryAction}
      inputStatus={inputStatus}
      inputPrelimStatus={inputPrelimStatus}
      userInput={userInput}
      onUserInputChange={onUserInputChange}
    />
  );
}
