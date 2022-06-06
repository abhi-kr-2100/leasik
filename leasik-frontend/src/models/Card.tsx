import Sentence from "./Sentence";

type Card = {
  id: string;
  note: string;
  sentence: Sentence;
  hiddenWordPosition: number;
};

export default Card;
