import { useQuery } from "@apollo/client";

import { GET_BOOKS } from "../utilities/queries";

import * as Types from "../utilities/types";

import Books from "./Books";
import Book from "./Book";

export default function BooksController() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`couldn't retrive books: ${error.message}`}</div>;

  const books = getBooksFromResponse(data);
  const bookComponents = books.map((sl) => <Book book={sl} />);

  return <Books books={bookComponents} />;
}

function getBooksFromResponse(resp: { books: { edges: Types.BookEdge[] } }) {
  return resp.books.edges.map(({ node: book }) => ({
    ...book,
    tags: book.tags.edges.map(({ node: tag }) => tag.label),
  }));
}
