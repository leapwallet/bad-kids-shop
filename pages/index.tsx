import { useQuery } from "urql";
import { GenericNFTCard } from "../components/GenericNFTCard";
import { useMemo } from "react";
import { WalletSection } from "../components";
import { toUtf8 } from "@cosmjs/encoding";
import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import BadkidsLogo from "../public/bad_kids_logo.svg";
import Search from "../public/search.svg";
import Sort from "../public/sort.svg";
import StargazeLogo from "../public/stargaze-logo.svg";
import WalletIcon from "../public/account_balance_wallet.svg";

import { cosmwasm, getSigningCosmwasmClient } from "stargazejs";

import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Text from "../components/Text";
import { sliceAddress } from "../config/formatAddress"
import toast, { Toaster } from "react-hot-toast";

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

  console.log("logging execute contract tx", executeContractTx);

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
      name
      rarityOrder
      owner {
        address
      }
      collection {
        tokenCounts {
          total
        }
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
      collectionAddr: BAD_KIDS_COLLECTION,
      limit: 10,
      offset: 10,
      filterForSale: "FIXED_PRICE",
      sortBy: "PRICE_ASC",
    },
  });

  const nfts = useMemo(() => {
    return result.data?.tokens.tokens
      .filter((token: any) => token.owner.address !== address)
      .map((token: any) => {
        return {
          image: token.media.url,
          media_type: token.media.type,
          name: token.metadata.name,
          tokenId: token.tokenId,
          listPrice: token.listPrice,
          traits: token.traits,
          rarityOrder: token.rarityOrder,
          collection: {
            name: token.collection.name,
            media_type: token.collection.media.type,
            image: token.collection.media.url,
            contractAddress: token.collection.contractAddress,
            tokenCount: token.collection.tokenCounts.total,
          },
        };
      });
  }, [result]);
  console.log("logging nfts", nfts);

  const onnNFTClick = async (nft: any) => {
    if (!address) return;
    try {
      toast(`Please sign the transaction on your wallet`)
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
  
      const signer = getOfflineSignerDirect();
  
      const signingCosmwasmClient = await getSigningCosmwasmClient({
        rpcEndpoint: chain.apis?.rpc?.[0].address ?? "",
        signer: signer,
      });
  
      const fee = {
        amount: [
          {
            amount: "0",
            denom: "ustars",
          },
        ],
        gas: "1000000",
      };
  
      const signedTx = await signingCosmwasmClient.sign(address, [tx], fee, "");
      const txRaw = TxRaw.encode({
        bodyBytes: signedTx.bodyBytes,
        authInfoBytes: signedTx.authInfoBytes,
        signatures: signedTx.signatures,
      }).finish();
  
      const res = await signingCosmwasmClient.broadcastTx(txRaw);
      
      toast.success(`Transaction sent successfully`)
      
    }catch(e: any){
      toast.error(`Error: ${e.message}`)

    }
    
    

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

function WalletButton() {
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
  } = useChain("stargaze");
  let text = "Connect Wallet";
  if (status === "Connected") {
    text = sliceAddress(address);
  } else if (status === "Connecting") {
    text = "Connecting...";
  }

  return (
    <div>
      <button
        onClick={() => openView()}
        className="flex items-center gap-2 justify-between border border-white-100 rounded-3xl px-5 py-2"
      >
        <Image src={WalletIcon} alt="wallet" height={16} width={16} />
        <Text size="sm" color="text-white-100 font-bold">
          {text}
        </Text>
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="px-14 py-8">
      <section className="flex flex-wrap items-center justify-between mb-16">
        <Image src={BadkidsLogo} alt="bad-kids" />
        <div className="flex gap-3">
          <button onClick={() => window.open("https://cosmos.leapwallet.io/transact/swap", "_blank")} className="flex gap-2 items-center justify-between border border-white-100 rounded-3xl px-5 py-2">
            <Image src={StargazeLogo} height={16} width={16} alt="get stars" />
            <Text size="sm" color="text-white-100 font-bold">
              Get Stars
            </Text>
          </button>
          <WalletButton />
        </div>
      </section>
      <section className="mb-8 flex flex-wrap justify-between">
        <div className="">
          <Text size="md">Collection of 9,999 bad drawings of kids. </Text>
          <Text size="md">
            Some people like the pictures and some people are bad kids
            themselves.
          </Text>
        </div>
        <div className="flex items-center ml-auto justify-between">
          <button
            className="flex items-center bg-black-100 px-4 py-2 rounded-3xl mr-2"
            style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
          >
            <Image src={Search} height={16} width={16} alt="search" />
            <Text className="ml-2 font-bold">Token ID</Text>
          </button>
          <button className="flex items-center bg-black-100 px-4 py-2 rounded-3xl">
            <Image src={Sort} height={16} width={16} alt="sort" />
            <Text
              className="ml-2 font-bold"
              style={{ boxShadow: "-11px 15px 23.4px 0px rgba(0, 0, 0, 0.41)" }}
            >
              Sort
            </Text>
          </button>
        </div>
      </section>
      <NFTs />
      <Toaster position="bottom-right" />
    </div>
  );
}
