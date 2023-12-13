import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://graphql.mainnet.stargaze-apis.com/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Tokens: {
        fields: {
          tokens: {
            keyArgs: false,

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming = []) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
