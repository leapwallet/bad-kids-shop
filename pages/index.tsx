import {
  useColorMode,
} from '@chakra-ui/react';
import Text from '../components/Text';
import { client } from '../config/urqlclient';
import { useQuery} from 'urql'
import { GenericNFTCard } from '../components/GenericNFTCard';
import { useMemo } from 'react';

const getNFTTokensQuery = `
  query Tokens($collectionAddr: String!, $limit: Int, $offset: Int, $filterForSale: SaleType, $sortBy: TokenSort) {
  tokens(collectionAddr: $collectionAddr, limit: $limit, offset: $offset, filterForSale: $filterForSale, sortBy: $sortBy) {
    tokens {
      description
      collection {
        media {
          type
          url
        }
        name 
      }
      listedAt
      listPrice {
        amount
        denom
      }
      media {
        type
      }
      metadata
      traits {
        name
        rarity
        rarityPercent
        rarityScore
      }
      
      tokenId
      tokenUri
      saleType
      owner {
        address
      }
    } 
}
  }`


function NFTs() {
  const [result] = useQuery({
    query: getNFTTokensQuery,
    variables: {
      collectionAddr: "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420",
      limit: 10,
      offset: 10,
      filterForSale: "FIXED_PRICE",
      sortBy: "PRICE_ASC"
    }
  })

  const nfts = useMemo(() => {
    return result.data?.tokens.tokens.map((token: any) => {
      return {
        image: token.metadata.image,
        media_type: token.media.type,
        nftName: token.metadata.name,
        collection: {
          name: token.collection.name,
          media_type: token.collection.media.type,
          image: token.collection.media.url
        }
      }
    })
  }, [result])
  return (
    <div className='flex flex-wrap gap-x-3 gap-y-3 rounded-3xl border-[0] border-gray-100 p-0 shadow-[0_7px_24px_0px_rgba(0,0,0,0.25)] shadow-[0] dark:border-gray-900 sm:gap-x-6 sm:gap-y-8 sm:border sm:!p-6'>
      {nfts && nfts.map((nft: any) => <GenericNFTCard nft={nft} />)}
    </div>
  );

}


export default function Home() {
  return <div>
   <NFTs />
  </div>

}
