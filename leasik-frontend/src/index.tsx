import React from "react";
import ReactDOM from "react-dom/client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import Home from "./components/Home";
import ListsController from "./components/ListsController";
import ListPlayController from "./components/ListPlayController";
import LoginController from "./components/LoginController";

const httpLink = createHttpLink({
  uri: "https://leasik.herokuapp.com/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const graphQLClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={graphQLClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="lists" element={<ListsController />} />
            <Route path="lists/:listId" element={<ListPlayController />} />
            <Route path="login" element={<LoginController />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
