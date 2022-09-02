import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";

import graphQLClient from "./utilities/graphQLClient";

import App from "./App";
import Home from "./components/Home";
import ListsController from "./components/ListsController";
import ListPlayController from "./components/ListPlayController";
import LoginController from "./components/LoginController";

import "./index.css";

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
