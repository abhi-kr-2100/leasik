import { partitionSentence } from "../utilities/helperFuncs";

export interface IQuestionProps {
  text: string;
  translation: string;
  hiddenWordPosition: number;
}

export default function Question(props: IQuestionProps) {
  const [beforeHiddenWord, afterHiddenWord] = partitionSentence(
    props.text,
    props.hiddenWordPosition
  );

  return (
    <div className="text-center">
      <div>
        <div className="text-xl my-3">
          <p className="inline">{beforeHiddenWord}</p>
          <input className="inline mx-1 p-2 text-center" autoFocus />
          <p className="inline">{afterHiddenWord}</p>
        </div>
      </div>
      <div>
        <p>{props.translation}</p>
      </div>
    </div>
  );
}
