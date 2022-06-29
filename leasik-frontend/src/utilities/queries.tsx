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

export const GET_BOOKMARKED_CARDS = gql`
  query GetBookmarkedCards($sentenceListId: ID!, $n: Int) {
    cards(
      sentenceListId: $sentenceListId
      bookmarked: true
      randomize: true
      first: $n
    ) {
      edges {
        node {
          id
          hiddenWordPosition
          hiddenWordPositions
          isBookmarked
          sentence {
            id
            text
            translation
          }
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
          isBookmarked
          sentence {
            id
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
          isBookmarked
          sentence {
            id
            text
            translation
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

export const ADD_CARD = gql`
  mutation AddCard($sentenceId: ID!, $hiddenWordPosition: Int!) {
    addCard(
      input: {
        sentenceId: $sentenceId
        hiddenWordPosition: $hiddenWordPosition
      }
    ) {
      clientMutationId
    }
  }
`;

export const REMOVE_CARD = gql`
  mutation RemoveCard($sentenceId: ID!, $hiddenWordPosition: Int!) {
    removeCard(
      input: {
        sentenceId: $sentenceId
        hiddenWordPosition: $hiddenWordPosition
      }
    ) {
      clientMutationId
    }
  }
`;
