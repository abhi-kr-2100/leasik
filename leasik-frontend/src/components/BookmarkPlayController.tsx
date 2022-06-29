import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_BOOKMARKED_CARDS } from "../utilities/queries";
import { normalizedCard } from "../utilities/helperFuncs";

import Card from "../models/Card";

import ListPlay from "./ListPlay";

export default function BookmarkPlayController() {
  const sentenceListId = useParams().listId;

  const { loading, error, data } = useQuery(GET_BOOKMARKED_CARDS, {
    variables: { sentenceListId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const cardEdges = data.cards.edges as { node: Card }[];
  const cards = cardEdges.map((edge) => normalizedCard(edge.node));

  return <ListPlay cards={cards} />;
}
