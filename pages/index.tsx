import { useQuery } from "urql";
import { GenericNFTCard } from "../components/GenericNFTCard";
import { useMemo } from "react";
import { WalletSection } from "../components";
import { toUtf8 } from "@cosmjs/encoding";
import { useChain } from "@cosmos-kit/react";

import { cosmwasm, getSigningCosmwasmClient } from "stargazejs";

import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";


const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;

const STARGAZE_MARKET_CONTRACT =
  "stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl";

function createBuyNftTx({
  sender,
  collection,
  tokenId,
  expiry,
  funds,
}: {
  sender: string;
  collection: string;
  tokenId: number;
  expiry: string;
  funds: Array<{ amount: string; denom: string }>;
}) {
  const tx = {
    msg: {
      buy_now: {
        collection: collection,
        token_id: tokenId,
        expires: expiry,
      },
    },
    memo: "",
    funds: funds,
  };

  const executeContractTx = executeContract({
    sender: sender,
    contract: STARGAZE_MARKET_CONTRACT,
    msg: toUtf8(JSON.stringify(tx.msg)),
    funds: funds,
  });

  console.log('logging execute contract tx', executeContractTx)

  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: executeContractTx.value,
  };
}

const getNFTTokensQuery = `
  query Tokens($collectionAddr: String!, $limit: Int, $offset: Int, $filterForSale: SaleType, $sortBy: TokenSort) {
  tokens(collectionAddr: $collectionAddr, limit: $limit, offset: $offset, filterForSale: $filterForSale, sortBy: $sortBy) {
    tokens {
      description
      owner {
        address
      }
      collection {
        media {
          type
          url
        }
        name
        contractAddress
      }
      listedAt
      listPrice {
        amount
        denom
      }
      media {
        type
        url
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
  }`;

const BAD_KIDS_COLLECTION =
  "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420";
const SASQUATCH_SOCIETY_COLLECTION =
  "stars1edsg4rct2h5t4wawysxhef0mzprpcfsn5v8cxklj65uf2kkpvs8shk4pre";

function NFTs() {
  const { address, chain, getOfflineSignerDirect } = useChain("stargaze");

  const [result] = useQuery({
    query: getNFTTokensQuery,
    variables: {
      collectionAddr: SASQUATCH_SOCIETY_COLLECTION,
      limit: 10,
      offset: 10,
      filterForSale: "FIXED_PRICE",
      sortBy: "PRICE_ASC",
    },
  });

  const nfts = useMemo(() => {
    return result.data?.tokens.tokens.filter((token: any) => token.owner.address !== address ).map((token: any) => {
      return {
        image: token.media.url,
        media_type: token.media.type,
        nftName: token.metadata.name,
        tokenId: token.tokenId,
        listPrice: token.listPrice,
        collection: {
          name: token.collection.name,
          media_type: token.collection.media.type,
          image: token.collection.media.url,
          contractAddress: token.collection.contractAddress,
        },
      };
    });
  }, [result]);

  const onnNFTClick = async (nft: any) => {
    if(!address) return
    const twoWeekExpiry = 14 * 24 * 60 * 60 * 1000;
    const tx = createBuyNftTx({
      sender: address,
      collection: nft.collection.contractAddress,
      tokenId: parseInt(nft.tokenId),
      expiry: ((Date.now() + twoWeekExpiry) * 1000_000).toString(),
      funds: [
        {
          denom: nft.listPrice.denom,
          amount: nft.listPrice.amount,
        },
      ],
    });

    const signer = getOfflineSignerDirect()

    const signingCosmwasmClient = await getSigningCosmwasmClient({
      rpcEndpoint: chain.apis?.rpc?.[0].address ?? '',
      signer: signer
    });

    const fee = {
      amount: [
        {
          amount: "0",
          denom: "ustars"
        }
      ],
      gas: '1000000'
    }
    console.log('logging tx', tx)
    

    const signedTx = await signingCosmwasmClient.sign(address, [tx], fee, "")
    const txRaw = TxRaw.encode({
      bodyBytes: signedTx.bodyBytes,
      authInfoBytes: signedTx.authInfoBytes,
      signatures: signedTx.signatures
    }).finish()
    
    const res = await signingCosmwasmClient.broadcastTx(txRaw)
    console.log('loggin res', res)

    

    console.log('logging result', signedTx)
  };

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-3 rounded-3xl border-[0] border-gray-100 p-0 shadow-[0_7px_24px_0px_rgba(0,0,0,0.25)] shadow-[0] dark:border-gray-900 sm:gap-x-6 sm:gap-y-8 sm:border sm:!p-6">
      {nfts &&
        nfts.map((nft: any) => (
          <GenericNFTCard
            nft={nft}
            key={nft.tokenId}
            onNFTClick={onnNFTClick}
          />
        ))}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <WalletSection />
      <NFTs />
    </div>
  );
}
