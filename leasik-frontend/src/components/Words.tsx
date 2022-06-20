import { InputStatusType } from "../utilities/types";
import Card from "../models/Card";
import WordController from "./WordController";

export interface IWordsProps {
  card: Card;
  wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[];
  inputStatus: InputStatusType;
}

export default function Words(props: IWordsProps) {
  const bgClassName =
    props.inputStatus === "unchecked" ? "text-transparent" : "";

  return (
    <p className={`my-3 ${bgClassName}`}>
      {props.wordsXIsHiddenMatrix.map((mat, i) => (
        <>
          <WordController
            inputStatus={props.inputStatus}
            card={props.card}
            wordPosition={i}
            word={mat.word}
            isHidden={mat.isHidden}
          />{" "}
        </>
      ))}
    </p>
  );
}
