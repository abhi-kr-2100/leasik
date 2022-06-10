import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_CARDS } from "../utilities/queries";
import Card from "../models/Card";
import ListPlay from "./ListPlay";

export default function ListPlayController() {
  const sentenceListId = useParams().listId;

  const { loading, error, data } = useQuery(GET_CARDS, {
    variables: { sentenceListId, n: 20 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const cardEdges = data.cardsUpForReview.edges as { node: Card }[];
  const backupCardEdges = data.cardsNotUpForReview.edges as {
    node: Card;
  }[];

  const cards = (cardEdges.length !== 0 ? cardEdges : backupCardEdges).map(
    (edge) => edge.node
  );

  return <ListPlay cards={cards} />;
}
