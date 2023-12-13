import { createClient, cacheExchange, fetchExchange } from 'urql'


export const client = createClient({
  url: 'https://graphql.mainnet.stargaze-apis.com/graphql',
  exchanges: [cacheExchange, fetchExchange],
})
