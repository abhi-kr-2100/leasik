import { ReactElement, useState } from "react";

import { ICardProps } from "./Card";
import QuestionScreen from "./QuestionScreen";

export interface IListPlayProps {
  cards: ReactElement<ICardProps>[];
}

export default function ListPlay(props: IListPlayProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      {currentCardIndex >= props.cards.length ? (
        <p>Finished!</p>
      ) : (
        <QuestionScreen
          card={props.cards[currentCardIndex]}
          onNext={() => setCurrentCardIndex(currentCardIndex + 1)}
        />
      )}
    </div>
  );
}
