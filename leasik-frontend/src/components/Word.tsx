export interface IWordProps {
  word: string;
  isHighlighted: boolean;
  onClick: () => void;
}

export default function Word(props: IWordProps) {
  return (
    <span
      onClick={() => props.onClick()}
      className={props.isHighlighted ? "bg-blue-500" : ""}
    >
      {props.word}
    </span>
  );
}
