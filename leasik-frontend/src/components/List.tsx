import { Link } from "react-router-dom";

import SentenceList from "../models/SentenceList";
import ListDescription from "./ListDescription";

export interface IListProps {
  sentenceList: SentenceList;
}

export default function List(props: IListProps) {
  return (
    <article className="my-2 mx-auto w-9/10 lg:w-1/2 md:w-3/4 border rounded">
      <header className="p-1 bg-emerald-300 text-white text-xl">
        <h2>{props.sentenceList.name}</h2>
      </header>
      <div className="p-2">
        <ListDescription text={props.sentenceList.description} />
        <Link to={`/lists/${props.sentenceList.id}`}>
          <button className="mt-2 mr-2 px-1 py-1 bg-emerald-300 w-3/12 text-center text-white rounded">
            Play
          </button>
        </Link>
        <Link to={`/lists/${props.sentenceList.id}/bookmarks`}>
          <button className="mt-2 mr-2 px-1 py-1 bg-emerald-300 w-3/12 text-center text-white rounded">
            Bookmarks
          </button>
        </Link>
      </div>
    </article>
  );
}
