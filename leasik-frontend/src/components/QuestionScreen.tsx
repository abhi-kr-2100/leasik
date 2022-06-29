import Card from "../models/Card";
import ActionButtons from "./ActionButtons";
import Question from "./Question";

export interface IQuestionScreenProps {
  card: Card;
  primaryAction: () => void;
  inputStatus: "unchecked" | "correct" | "incorrect";
  userInput: string;
  setUserInput: (input: string) => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <div className="my-2">
        <Question
          card={props.card}
          inputStatus={props.inputStatus}
          userInput={props.userInput}
          setUserInput={props.setUserInput}
          primaryAction={props.primaryAction}
        />
      </div>
      <ActionButtons
        card={props.card}
        inputStatus={props.inputStatus}
        primaryAction={props.primaryAction}
      />
    </>
  );
}
