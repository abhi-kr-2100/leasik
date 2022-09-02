import Card from "../models/Card";
import { toWords } from "../utilities/helperFuncs";
import { InputStatusType } from "../utilities/types";
import Words from "./Words";

export interface IWordsControllerProps {
  card: Card;
  inputStatus: InputStatusType;
}

export default function WordsController(props: IWordsControllerProps) {
  const words = toWords(props.card.sentence.text);

  const wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[] = words.map(
    (w) => ({ word: w, isHidden: false })
  );

  return (
    <Words
      card={props.card}
      wordsXIsHiddenMatrix={wordsXIsHiddenMatrix}
      inputStatus={props.inputStatus}
    />
  );
}
