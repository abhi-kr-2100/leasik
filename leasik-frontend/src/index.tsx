import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";

import graphQLClient from "./utilities/graphQLClient";

import App from "./App";
import Home from "./components/Home";
import BooksController from "./components/BooksController";
import BookPlayController from "./components/BookPlayController";
import LoginController from "./components/LoginController";
import LogoutController from "./components/LogoutController";

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
            <Route path="books" element={<BooksController />} />
            <Route path="books/:bookId" element={<BookPlayController />} />
            <Route path="login" element={<LoginController />} />
            <Route path="logout" element={<LogoutController />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
