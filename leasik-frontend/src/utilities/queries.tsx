import { gql } from "@apollo/client";

export const GET_JWT_TOKEN = gql`
  mutation GetJWTToken($username: String, $password: String) {
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

export const GET_CARDS_UP_FOR_REVIEW = gql`
  query GetCardsUpForReview($sentenceListId: ID!, $n: Int) {
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

export const GET_CARDS_NOT_UP_FOR_REVIEW = gql`
  query GetCardsNotUpForReview($sentenceListId: ID!, $n: Int) {
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
