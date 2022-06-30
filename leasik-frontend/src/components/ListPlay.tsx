import { useState } from "react";

import Card from "../models/Card";
import QuestionScreenController from "./QuestionScreenController";

export interface IListPlayProps {
  cards: Card[];
}

export default function ListPlay(props: IListPlayProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {currentCardIndex >= props.cards.length ? (
        <p>Finished!</p>
      ) : (
        <QuestionScreenController
          key={currentCardIndex}
          card={props.cards[currentCardIndex]}
          onNext={() => setCurrentCardIndex(currentCardIndex + 1)}
        />
      )}
    </div>
  );
}
