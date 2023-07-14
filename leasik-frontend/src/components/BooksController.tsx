import { useQuery } from "@apollo/client";

import { GET_BOOKS } from "../utilities/queries";

import Book from "../models/SentenceList";

import Lists from "./Books";
import List from "./Book";

export default function ListsController() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`couldn't retrive lists: ${error.message}`}</div>;

  const listEdges = data.books.edges as { node: Book }[];
  const books = listEdges.map((edge) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description,
  }));

  const lists = books.map((sl) => <List book={sl} />);

  return <Lists lists={lists} />;
}
