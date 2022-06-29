import Sentence from "./Sentence";

type Card = {
  id: string;
  sentence: Sentence;
  hiddenWordPosition: number;
  hiddenWordPositions: number[];
  isBookmarked: boolean;
};

export default Card;
