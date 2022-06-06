export interface ICardProps {
  id: string;
  text: string;
  translation: string;
  note: string;
  isBookmarked: boolean;
}

export default function Card(props: ICardProps) {
  return (
    <div>
      <div>{props.text}</div>
      <div>{props.translation}</div>
      <div>{props.note}</div>
    </div>
  );
}
