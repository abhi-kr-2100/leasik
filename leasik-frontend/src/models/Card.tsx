import Sentence from "./Sentence";

type Card = {
  id: string;
  sentence: Sentence;
  hiddenWordPosition: number;
  hiddenWordPositions: number[];
};

export default Card;
