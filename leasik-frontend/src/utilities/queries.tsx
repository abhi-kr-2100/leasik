import { gql } from "@apollo/client";

export const GET_JWT_TOKEN = gql`
  mutation GetJWTToken($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const GET_SENTENCE_LISTS = gql`
  query GetSentenceLists {
    sentenceLists {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`;

export const GET_WORD_CARDS = gql`
  query GetWordCards($sentenceListId: ID!, $n: Int) {
    wordCards(sentenceListId: $sentenceListId, first: $n) {
      edges {
        node {
          id
          word
          sentences(first: 1) {
            edges {
              node {
                id
                text
                translation
              }
            }
          }
        }
      }
    }
  }
`;

export const SCORE_ANSWER = gql`
  mutation UpdateCardProficiency($cardId: ID!, $score: Int!) {
    updateProficiency(input: { cardId: $cardId, score: $score }) {
      clientMutationId
    }
  }
`;
