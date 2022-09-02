import { useState } from "react";

import WordCard from "../models/WordCard";
import QuestionScreenController from "./QuestionScreenController";

export interface IListPlayProps {
  wordCards: WordCard[];
}

export default function ListPlay(props: IListPlayProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {currentCardIndex >= props.wordCards.length ? (
        <p>Finished!</p>
      ) : (
        <QuestionScreenController
          key={currentCardIndex}
          wordCard={props.wordCards[currentCardIndex]}
          onNext={() => setCurrentCardIndex(currentCardIndex + 1)}
        />
      )}
    </div>
  );
}
