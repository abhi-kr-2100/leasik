import { gql } from "@apollo/client";

export const JWT_TOKEN = gql`
  mutation TokenAuth($username: String, $password: String) {
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

export const SENTENCE_LISTS = gql`
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

export const CARDS_FOR_REVIEW = gql`
  query GetCardsForReview($sentenceListId: ID!, $n: Int) {
    cards(
      sentenceListId: $sentenceListId
      reviewable: true
      randomize: true
      first: $n
    ) {
      edges {
        node {
          id
          hiddenWordPosition
          note
          sentence {
            text
            translation
          }
        }
      }
    }
  }
`;

export const CARDS_NOT_FOR_REVIEW = gql`
  query GetCardsNotForReview($sentenceListId: ID!, $n: Int) {
    cards(
      sentenceListId: $sentenceListId
      reviewable: false
      randomize: true
      first: $n
    ) {
      edges {
        node {
          id
          hiddenWordPosition
          note
          sentence {
            text
            translation
          }
        }
      }
    }
  }
`;
