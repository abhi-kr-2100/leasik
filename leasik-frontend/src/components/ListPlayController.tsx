import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_WORD_CARDS } from "../utilities/queries";

import ListPlay from "./ListPlay";
import { WordCardEdge } from "../utilities/types";

export default function ListPlayController() {
  const sentenceListId = useParams().listId;

  const { loading, error, data } = useQuery(GET_WORD_CARDS, {
    variables: { sentenceListId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const wordCards = (data.wordCards.edges as WordCardEdge[]).map(edge => ({
    id: edge.node.id,
    word: edge.node.word,
    sentence: edge.node.sentences.edges[0].node
  }))

  return <ListPlay wordCards={wordCards} />;
}
