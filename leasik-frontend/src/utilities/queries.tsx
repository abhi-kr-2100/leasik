import { gql } from "@apollo/client";

export const GET_JWT_TOKEN = gql`
  mutation GetJWTToken($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      edges {
        node {
          id
          name
          description
          tags {
            edges {
              node {
                id
                label
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SENTENCES = gql`
  query GetSentences(
    $bookId: ID!
    $tags: [String]
    $includeUntagged: Boolean
    $n: Int
  ) {
    sentences(
      bookId: $bookId
      tags: $tags
      includeUntagged: $includeUntagged
      first: $n
    ) {
      edges {
        node {
          id
          text
          translation
          textLanguage
          textLocale
          wordSet {
            edges {
              node {
                id
                word
                proficiencyScore
              }
            }
          }
        }
      }
    }
  }
`;

export const SCORE_ANSWER = gql`
  mutation UpdateWordProficiency($wordId: ID!, $score: Int!) {
    updateProficiency(input: { wordId: $wordId, score: $score }) {
      clientMutationId
    }
  }
`;
