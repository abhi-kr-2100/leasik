import { InputStatusType } from "../utilities/types";
import Card from "../models/Card";
import Word from "./Word";

export interface IWords {
  card: Card;
  wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[];
  inputStatus: InputStatusType;
}

export default function Words(props: IWords) {
  const bgClassName =
    props.inputStatus === "unchecked" ? "text-transparent" : "";

  return (
    <p className={`my-3 ${bgClassName}`}>
      {props.wordsXIsHiddenMatrix.map((mat, i) => (
        <>
          <Word
            inputStatus={props.inputStatus}
            card={props.card}
            wordPosition={i}
            word={mat.word}
            isHidden={mat.isHidden && props.inputStatus !== "unchecked"}
          />{" "}
        </>
      ))}
    </p>
  );
}
