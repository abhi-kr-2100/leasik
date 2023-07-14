import { ReactElement } from "react";
import { IBookProps } from "./Book";

export interface IBooksProps {
  books: ReactElement<IBookProps>[];
}

export default function Books(props: IBooksProps) {
  return (
    <>
      {props.books.length === 0 ? (
        <p>No books to show.</p>
      ) : (
        <ul>
          {props.books.map((book) => (
            <li key={book.props.book.id}>{book}</li>
          ))}
        </ul>
      )}
    </>
  );
}
