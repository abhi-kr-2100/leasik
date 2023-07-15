import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const backendAPI = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_URI,
});

const withAuthToken = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const graphQLClient = new ApolloClient({
  link: withAuthToken.concat(backendAPI),
  cache: new InMemoryCache(),
});

export default graphQLClient;
