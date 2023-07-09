import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_WORD_CARDS } from "../utilities/queries";

import ListPlay from "./ListPlay";
import { WordCardEdge } from "../utilities/types";
import { findWordPositions, randomChoice, toWords } from "../utilities/helperFuncs";
import { ExtendedWordCard } from "../utilities/types";

export default function ListPlayController() {
  const sentenceListId = useParams().listId;

  const { loading, error, data } = useQuery(GET_WORD_CARDS, {
    variables: { sentenceListId, n: 20 },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error loading cards: ${error.message}`}</div>;

  const wordCards = (data.wordCards.edges as WordCardEdge[])
    .filter((edge) => edge.node.sentences.edges.length !== 0)
    .map(edge => ({
      id: edge.node.id,
      word: edge.node.word,
      sentence: edge.node.sentences.edges[0].node
    }));

  const extendedWordCards = wordCards.map((wc) => ({
    ...wc,
    hiddenWordPosition: randomChoice(
      findWordPositions(toWords(wc.sentence.text), wc.word, wc.sentence.textLocale)
    )
  } as ExtendedWordCard))

  return <ListPlay extendedWordCards={extendedWordCards} />;
}
