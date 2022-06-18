import Words from "./Words";

export interface IWordsControllerProps {
  words: string[];
  hiddenWordPositions: number[];
  zeroError: number;
}

export default function WordsController(props: IWordsControllerProps) {
  const hiddenWordPositions = props.hiddenWordPositions.slice().sort();

  let wordsXIsHiddenMatrix: { word: string; isHidden: boolean }[] = [];
  let hwpi = 0;
  for (let i = 0; i < props.words.length; i++) {
    if (hwpi >= hiddenWordPositions.length) {
      wordsXIsHiddenMatrix.push({ word: props.words[i], isHidden: false });
    } else if (i + props.zeroError === hiddenWordPositions[hwpi]) {
      wordsXIsHiddenMatrix.push({ word: props.words[i], isHidden: true });
      hwpi++;
    } else {
      wordsXIsHiddenMatrix.push({ word: props.words[i], isHidden: false });
    }
  }

  return <Words wordsXIsHiddenMatrix={wordsXIsHiddenMatrix} />;
}
