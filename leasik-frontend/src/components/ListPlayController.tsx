import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_WORD_CARDS } from "../utilities/queries";

import WordCard from "../models/WordCard";

import ListPlay from "./ListPlay";

export default function ListPlayController() {
  const sentenceListId = useParams().listId;

  const { loading, error, data } = useQuery(GET_WORD_CARDS, {
    variables: { sentenceListId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const wordCardEdges = data.wordCards.edges as { node: WordCard }[];
  const wordCards = wordCardEdges.map(edge => edge.node)

  return <ListPlay wordCards={wordCards} />;
}
