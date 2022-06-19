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
  const hiddenWordPositions = props.card.hiddenWordPositions.slice().sort();

  let wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[] = [];
  let hwpi = 0;
  for (let i = 0; i < words.length; i++) {
    if (hwpi >= hiddenWordPositions.length) {
      wordsXIsHiddenMatrix.push({ word: words[i], isHidden: false });
    } else if (i === hiddenWordPositions[hwpi]) {
      wordsXIsHiddenMatrix.push({ word: words[i], isHidden: true });
      hwpi++;
    } else {
      wordsXIsHiddenMatrix.push({ word: words[i], isHidden: false });
    }
  }

  return (
    <Words
      wordsXIsHiddenMatrix={wordsXIsHiddenMatrix}
      inputStatus={props.inputStatus}
    />
  );
}
