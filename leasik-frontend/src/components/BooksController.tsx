import { useQuery } from "@apollo/client";

import { GET_BOOKS } from "../utilities/queries";

import Book from "../models/Book";

import Books from "./Books";
import BookComponent from "./Book";

export default function BooksController() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`couldn't retrive books: ${error.message}`}</div>;

  const bookEdges = data.books.edges as { node: Book }[];
  const books = bookEdges.map((edge) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description,
  }));

  const bookComponents = books.map((sl) => <BookComponent book={sl} />);

  return <Books books={bookComponents} />;
}
