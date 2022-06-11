import Sentence from "./Sentence";

type Card = {
  id: string;
  sentence: Sentence;
  hiddenWordPosition: number;
};

export default Card;
