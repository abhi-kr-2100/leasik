import { useState } from "react";

import Card from "../models/Card";
import Question from "./Question";

export interface IQuestionScreenProps {
  card: Card;
  onNext: () => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  const [userInput, setUserInput] = useState("");
  const [isInputChecked, setIsInputChecked] = useState(false);

  return (
    <>
      <div className="my-2">
        <Question
          text={props.card.sentence.text}
          translation={props.card.sentence.translation}
          hiddenWordPosition={props.card.hiddenWordPosition}
          checked={isInputChecked}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
      {!isInputChecked ? (
        <button
          onClick={() => setIsInputChecked(true)}
          className="my-2 px-3 py-2 bg-lime-300 rounded"
        >
          Check
        </button>
      ) : (
        <button
          onClick={() => {
            setUserInput("");
            setIsInputChecked(false);
            props.onNext();
          }}
          className="my-2 px-3 py-2 bg-lime-300 rounded"
        >
          Next
        </button>
      )}
    </>
  );
}