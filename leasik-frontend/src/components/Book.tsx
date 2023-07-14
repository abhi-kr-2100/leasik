import { Link } from "react-router-dom";

import Book from "../models/Book";
import BookDescription from "./BookDescription";

export interface IBookProps {
  book: Book;
}

export default function BookComponent(props: IBookProps) {
  return (
    <div className="border-b">
      <h2 className="p-1 bg-emerald-300 text-white text-xl">
        {props.book.name}
      </h2>
      <div className="p-2">
        <BookDescription text={props.book.description} />
        <Link className="inline-block rounded-sm px-3 py-1 bg-emerald-400 text-white" to={`/books/${props.book.id}`}>
          Play
        </Link>
      </div>
    </div>
  );
}
