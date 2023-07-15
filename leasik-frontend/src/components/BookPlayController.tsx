import { shuffle } from "lodash";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_SENTENCES } from "../utilities/queries";
import { SentenceEdge } from "../utilities/types";

import BookPlay from "./BookPlay";

export default function BookPlayController() {
  const bookId = useParams().bookId;

  const { loading, error, data } = useQuery(GET_SENTENCES, {
    variables: { bookId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const sentences = shuffle(getSentencesFromResponse(data));

  return <BookPlay sentences={sentences} />;
}

function getSentencesFromResponse(resp: {
  sentences: { edges: SentenceEdge[] };
}) {
  return resp.sentences.edges.map(({ node: sentence }) => ({
    ...sentence,
    words: sentence.wordSet.edges.map(({ node: word }) => word),
  }));
}
