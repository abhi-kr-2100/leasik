import Question from "./Question";

export interface ICardProps {
  id: string;
  text: string;
  translation: string;
  note: string;
  isBookmarked: boolean;
  hiddenWordPosition: number;
}

export default function Card(props: ICardProps) {
  return (
    <Question
      text={props.text}
      translation={props.translation}
      hiddenWordPosition={props.hiddenWordPosition}
    />
  );
}
