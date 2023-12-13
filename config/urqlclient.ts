import { createClient, cacheExchange, fetchExchange } from 'urql'


const mainnetUrl = "https://graphql.mainnet.stargaze-apis.com/graphql"


export const client = createClient({
  url: mainnetUrl,
  exchanges: [cacheExchange, fetchExchange],
})
