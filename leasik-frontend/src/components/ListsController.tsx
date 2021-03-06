import { useQuery } from "@apollo/client";

import { GET_SENTENCE_LISTS } from "../utilities/queries";

import SentenceList from "../models/SentenceList";

import Lists from "./Lists";
import List from "./List";

export default function ListsController() {
  const { loading, error, data } = useQuery(GET_SENTENCE_LISTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`couldn't retrive lists: ${error.message}`}</div>;

  const listEdges = data.sentenceLists.edges as { node: SentenceList }[];
  const sentenceLists = listEdges.map((edge) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description,
  }));

  const lists = sentenceLists.map((sl) => <List sentenceList={sl} />);

  return <Lists lists={lists} />;
}
