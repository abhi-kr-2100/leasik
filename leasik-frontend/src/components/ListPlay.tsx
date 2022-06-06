import { ReactElement } from "react";
import { ICardProps } from "./Card";

export interface IListPlayProps {
  cards: ReactElement<ICardProps>[];
}

export default function ListPlay(props: IListPlayProps) {
  return <div>Playing...</div>;
}
