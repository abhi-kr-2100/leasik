import { useState } from "react";

import { Sentence } from "../utilities/types";
import QuestionScreenController from "./QuestionScreenController";

export interface IBookPlayProps {
  sentences: Sentence[];
}

export default function BookPlay(props: IBookPlayProps) {
  const [currentSentenceIdx, setCurrentSentenceIndex] = useState(0);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {isFinished(currentSentenceIdx, props.sentences.length) ? (
        <p>Finished!</p>
      ) : (
        <QuestionScreenController
          key={currentSentenceIdx}
          sentence={props.sentences[currentSentenceIdx]}
          onNext={() => setCurrentSentenceIndex((current) => current + 1)}
        />
      )}
    </div>
  );
}

function isFinished(currentIndex: number, totalItems: number) {
  return currentIndex >= totalItems;
}
