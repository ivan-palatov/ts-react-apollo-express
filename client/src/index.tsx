import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createGlobalStyle } from 'styled-components';

import Routes from "./Routes";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include"
});

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
  }

  body: {
    background-color: rgb(255, 254, 252);
  }

  a {
    color: #0d0d0d;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <Routes />
  </ApolloProvider>,
  document.getElementById("root")
);
