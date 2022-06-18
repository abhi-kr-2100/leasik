export interface IWords {
  wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[];
}

export default function Words(props: IWords) {
  return (
    <p className="inline">
      {props.wordsXIsHiddenMatrix.map((mat) => (
        <span>
          <span className={`${mat.isHidden ? "bg-emerald-400" : ""}`}>
            {mat.word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
