import { ReactElement } from "react";
import { ICardProps } from "./Card";

export interface IListPlayProps {
  cards: ReactElement<ICardProps>[];
}

export default function ListPlay(props: IListPlayProps) {
  const mockCard = props.cards[0];

  return (
    <div className="min-h-full flex flex-col justify-center items-center">
      <div className="my-2">{mockCard}</div>
      <button className="my-2 px-3 py-2 bg-lime-300 rounded">Next</button>
    </div>
  );
}
