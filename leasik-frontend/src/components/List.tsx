import { Link } from "react-router-dom";

import SentenceList from "../models/SentenceList";

export interface IListProps {
  sentenceList: SentenceList;
}

export default function List(props: IListProps) {
  return (
    <article className="p-3 mx-auto w-9/10 lg:w-1/2 md:w-3/4">
      <div className="border rounded">
        <header className="p-1 bg-emerald-300 text-white text-xl">
          <h2>{props.sentenceList.name}</h2>
        </header>
        <div className="p-2">
          <div>
            {props.sentenceList.description
              .split("\n")
              .filter((d) => d.trim() !== "")
              .map((d, i) => (
                <p key={i} className={i !== 0 ? "pt-2" : ""}>
                  {d}
                </p>
              ))}
          </div>
          <div>
            <Link to={`/lists/${props.sentenceList.id}`}>
              <div className="mt-2 px-1 py-1 bg-emerald-300 w-3/12 text-center text-white rounded">
                Play
              </div>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
