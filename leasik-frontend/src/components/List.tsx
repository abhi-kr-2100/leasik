import { Link } from "react-router-dom";

import SentenceList from "../models/SentenceList";
import ListDescription from "./ListDescription";

export interface IListProps {
  sentenceList: SentenceList;
}

export default function List(props: IListProps) {
  return (
    <div className="border-b">
      <h2 className="p-1 bg-emerald-300 text-white text-xl">
        {props.sentenceList.name}
      </h2>
      <div className="p-2">
        <ListDescription text={props.sentenceList.description} />
        <Link className="inline-block rounded-sm px-3 py-1 bg-emerald-400 text-white" to={`/lists/${props.sentenceList.id}`}>
          Play
        </Link>
      </div>
    </div>
  );
}
