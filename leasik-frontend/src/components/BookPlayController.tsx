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

  const sentences = (data.sentences.edges as SentenceEdge[]).map(
    ({ node: sentence }) => ({
      id: sentence.id,
      text: sentence.text,
      translation: sentence.translation,
      locale: sentence.textLocale,
      language: sentence.textLanguage,
      words: sentence.wordSet.edges.map(({ node: word }) => ({
        id: word.id,
        score: word.proficiencyScore,
        word: word.word,
      })),
    })
  );

  return <BookPlay sentences={sentences} />;
}
