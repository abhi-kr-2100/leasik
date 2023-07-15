import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_SENTENCES } from "../utilities/queries";

import BookPlay from "./BookPlay";
import { SentenceEdge } from "../utilities/types";

export default function BookPlayController() {
  const bookId = useParams().bookId;

  const { loading, error, data } = useQuery(GET_SENTENCES, {
    variables: { bookId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const sentences = (data.sentences.edges as SentenceEdge[]).map((edge) => ({
    id: edge.node.id,
    text: edge.node.text,
    translation: edge.node.translation,
    locale: edge.node.textLocale,
    language: edge.node.textLanguage,
    words: edge.node.wordSet.edges.map((edge) => ({
      id: edge.node.id,
      score: edge.node.proficiencyScore,
      word: edge.node.word,
    })),
  }));

  return <BookPlay sentences={sentences} />;
}
