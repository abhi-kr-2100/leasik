import { Link } from "react-router-dom";

export interface IListProps {
  id: string;
  name: string;
  description: string;
}

export default function List(props: IListProps) {
  return (
    <article className="p-3 mx-auto w-9/10 lg:w-1/2 md:w-3/4">
      <div className="border rounded">
        <header className="p-1 bg-emerald-300 text-white text-xl">
          <h2>{props.name}</h2>
        </header>
        <div className="p-2">
          <div>{props.description}</div>
          <div>
            <Link to={`/lists/${props.id}`}>
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
