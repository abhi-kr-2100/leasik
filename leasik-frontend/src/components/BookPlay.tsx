import { useState } from "react";

import { ExtendedWordCard } from "../utilities/types";
import QuestionScreenController from "./QuestionScreenController";

export interface IListPlayProps {
  extendedWordCards: ExtendedWordCard[];
}

export default function ListPlay(props: IListPlayProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {currentCardIndex >= props.extendedWordCards.length ? (
        <p>Finished!</p>
      ) : (
        <QuestionScreenController
          key={currentCardIndex}
          extendedWordCard={props.extendedWordCards[currentCardIndex]}
          onNext={() => setCurrentCardIndex(currentCardIndex + 1)}
        />
      )}
    </div>
  );
}
