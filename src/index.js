import { StrictMode } from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  ApolloProvider,
} from '@apollo/client';
import { App } from './ui/app';

const httpLink = new HttpLink({
  uri: 'https://pleasing-anchovy-58.hasura.app/v1/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'content-type': 'application/json',
      'x-hasura-admin-secret': '',
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
);
