import Card from "../models/Card";
import Question from "./Question";

export interface IQuestionScreenProps {
  card: Card;
  onNext: () => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <div className="my-2">
        <Question
          text={props.card.sentence.text}
          translation={props.card.sentence.translation}
          hiddenWordPosition={props.card.hiddenWordPosition}
        />
      </div>
      <button
        onClick={props.onNext}
        className="my-2 px-3 py-2 bg-lime-300 rounded"
      >
        Next
      </button>
    </>
  );
}
