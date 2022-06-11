import { useState } from "react";

import Card from "../models/Card";
import ActionButtons from "./ActionButtons";
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
          card={props.card}
          checked={isInputChecked}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
      <ActionButtons
        card={props.card}
        userInput={userInput}
        setUserInput={setUserInput}
        isInputChecked={isInputChecked}
        setIsInputChecked={setIsInputChecked}
        onNext={props.onNext}
      />
    </>
  );
}
