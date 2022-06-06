import { ReactElement } from "react";

import { ICardProps } from "./Card";

export interface IQuestionScreenProps {
  card: ReactElement<ICardProps>;
  onNext: () => void;
}

export default function QuestionScreen(props: IQuestionScreenProps) {
  return (
    <>
      <div className="my-2">{props.card}</div>
      <button
        onClick={props.onNext}
        className="my-2 px-3 py-2 bg-lime-300 rounded"
      >
        Next
      </button>
    </>
  );
}
