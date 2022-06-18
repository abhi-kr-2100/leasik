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

export const GET_CARDS = gql`
  query GetCards($sentenceListId: ID!, $n: Int) {
    cardsUpForReview: cards(
      sentenceListId: $sentenceListId
      reviewable: true
      randomize: true
      first: $n
    ) {
      edges {
        node {
          id
          hiddenWordPosition
          hiddenWordPositions
          sentence {
            text
            translation
          }
        }
      }
    }

    cardsNotUpForReview: cards(
      sentenceListId: $sentenceListId
      reviewable: false
      randomize: true
      first: $n
    ) {
      edges {
        node {
          id
          hiddenWordPosition
          hiddenWordPositions
          sentence {
            text
            translation
          }
        }
      }
    }
  }
`;

export const INCREASE_CARD_PROFICIENCY = gql`
  mutation UpdateCardProficiency($cardId: ID!) {
    updateProficiency(input: { cardId: $cardId, score: 5 }) {
      card {
        id
      }
    }
  }
`;

export const DECREASE_CARD_PROFICIENCY = gql`
  mutation UpdateCardProficiency($cardId: ID!) {
    updateProficiency(input: { cardId: $cardId, score: 0 }) {
      card {
        id
      }
    }
  }
`;
