import { InputStatusType } from "../utilities/types";

export interface IWords {
  wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[];
  inputStatus: InputStatusType;
}

export default function Words(props: IWords) {
  return (
    <p
      className={`my-3 ${
        props.inputStatus === "unchecked" ? "text-transparent" : ""
      }`}
    >
      {props.wordsXIsHiddenMatrix.map((mat) => (
        <span>
          <span
            className={`${
              mat.isHidden && props.inputStatus !== "unchecked"
                ? "bg-emerald-400"
                : ""
            }`}
          >
            {mat.word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
