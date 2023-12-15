import { useQuery, gql } from "@apollo/client";

import { GenericNFTCard } from "./GenericNFTCard";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { toUtf8 } from "@cosmjs/encoding";
import { useChain } from "@cosmos-kit/react";
import { cosmwasm, getSigningCosmwasmClient } from "stargazejs";
import BN from "bignumber.js";

import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import toast from "react-hot-toast";
import { ListControl } from "./ListControl";
import { stat } from "fs";
import GenericNFTCardSkeleton from "./GenericNFTCardSkeleton";

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

  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: executeContractTx.value,
  };
}

const getNFTTokensQuery = gql`
  query Tokens(
    $collectionAddr: String!
    $limit: Int
    $offset: Int
    $filterForSale: SaleType
    $sortBy: TokenSort
  ) {
    tokens(
      collectionAddr: $collectionAddr
      limit: $limit
      offset: $offset
      filterForSale: $filterForSale
      sortBy: $sortBy
    ) {
      pageInfo {
        total
        limit
        offset
      }
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
  }
`;

const BAD_KIDS_COLLECTION =
  "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420";
const SASQUATCH_SOCIETY_COLLECTION =
  "stars1edsg4rct2h5t4wawysxhef0mzprpcfsn5v8cxklj65uf2kkpvs8shk4pre";

export function NFTs({ collection }: { collection?: string }) {
  const { address, chain, status, getOfflineSignerDirect, openView, connect } =
    useChain("stargaze");
  const [balance, setBalance] = useState<string>("0");
  const [isFetching, setIsFetching] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const [sortOrder, setSortOrder] = useState("low");

  const handleSortChange = (event: string) => {
    setSortOrder(event);
  };

  const {
    loading,
    error,
    data: result,

    fetchMore,
    refetch,
  } = useQuery(getNFTTokensQuery, {
    variables: {
      collectionAddr: collection ?? BAD_KIDS_COLLECTION,
      limit: 50,
      offset: 50,
      filterForSale: "FIXED_PRICE",
      sortBy: "PRICE_ASC",
    },
  });
  const offset = useRef(0);
  const total = useRef(0);
  total.current = result?.tokens?.pageInfo?.total ?? 0;
  offset.current = result?.tokens?.pageInfo?.offset ?? 0;

  useEffect(() => {
    const getBalance = async () => {
      const res = await fetch(
        `${chain.apis?.rest?.[0].address}/cosmos/bank/v1beta1/balances/${address}`
      );
      const response = await res.json();
      const starsBalance = response.balances.find(
        (balance: any) => balance.denom === "ustars"
      );

      setBalance(starsBalance?.amount ?? "0");
    };
    if (address) {
      getBalance();
    }
  }, [address]);

  useEffect(() => {
    const handleScroll = () => {
      const totalPageHeight = document.documentElement.scrollHeight;
      const scrollPoint = window.scrollY + window.innerHeight;
      if (scrollPoint >= totalPageHeight && offset.current < total.current) {
        //toast(`Loading more Bad Kids`, {position: "bottom-center"})
        setIsFetching(true);
        fetchMore({
          variables: {
            offset: offset.current + 50,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            const tokensSet = new Set();
            const newTokens = [...prev.tokens.tokens];

            prev.tokens.tokens.forEach((token: any) =>
              tokensSet.add(token.tokenId)
            );
            fetchMoreResult.tokens.tokens.forEach((token: any) => {
              if (!tokensSet.has(token.tokenId)) {
                newTokens.push(token);
              }
            });

            return Object.assign({}, prev, {
              tokens: {
                pageInfo: fetchMoreResult.tokens.pageInfo,
                tokens: newTokens,
              },
            });
          },
        });
        setTimeout(() => {
          setIsFetching(false);
        }, 3000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nfts = useMemo(() => {
    return result?.tokens?.tokens
      ?.filter((token: any) => token.owner.address !== address)
      .map((token: any) => {
        let cta = "Buy Now";
        if (address) {
          cta = "Buy Now";
        }

        return {
          image: token.media.url,
          media_type: token.media.type,
          name: token.metadata.name,
          tokenId: token.tokenId,
          listPrice: token.listPrice,
          traits: token.traits,
          rarityOrder: token.rarityOrder,
          cta,
          collection: {
            name: token.collection.name,
            media_type: token.collection.media.type,
            image: token.collection.media.url,
            contractAddress: token.collection.contractAddress,
            tokenCount: token.collection.tokenCounts.total,
          },
        };
      })
      .filter((nft: any) => nft.tokenId.includes(searchTerm))
      .sort((a: any, b: any) => {
        if (sortOrder === "low") {
          return +a.listPrice.amount - +b.listPrice.amount;
        } else if (sortOrder === "high") {
          return +b.listPrice.amount - +a.listPrice.amount;
        } else {
          return 0;
        }
      });
  }, [result, balance, searchTerm, sortOrder, status]);

  const onnNFTClick = async (
    nft: any,
    title: string,
    subtitle: string,
    imgUrl?: string
  ) => {
    if (!address) {
      connect();
      return;
    }
    //this is a hack to get around the fact that the elements does not expose a function to open the modal from other than renderLiquidityButton function
    //this is not ideal but it works for now
    const renderModalBtn = document.getElementById("open-liquidity-modal-btn");
    const shouldOpenModal = BN(nft.listPrice.amount).gt(balance);
    if (renderModalBtn && shouldOpenModal) {
      const titleElement = document.querySelector(
        "body > div.vcai130.leap-elements > div > div > div > div._1sc81q01 > div > div > h2"
      );
      const subtitleElement = document.querySelector(
        "body > div.vcai130.leap-elements > div > div > div > div._1sc81q01 > div > div > p"
      );
      const imageSrc = document.querySelector(
        "body > div.vcai130.leap-elements > div > div > div > div._1sc81q01 > div > img"
      );
      if (titleElement && title) {
        titleElement.innerHTML = title;
      }
      if (subtitleElement && subtitle) {
        subtitleElement.innerHTML = subtitle;
      }
      if (imageSrc && imgUrl) {
        imageSrc.setAttribute("src", imgUrl);
      }
      renderModalBtn.click();
      return;
    }

    try {
      toast(`Please sign the transaction on your wallet`, {
        className: "w-[400px]",
      });
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
        //@ts-ignore
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

      const res = signingCosmwasmClient.broadcastTx(txRaw);
      const broadcastToast = toast("Broadcasting transaction", {
        duration: 1000 * 60,
      });
      res
        .then((res: any) => {
          toast.dismiss(broadcastToast);
          toast.success(`Success! ${res.transactionHash}`, {
            className: "w-[400px]",
          });
        })
        .catch((e: any) => {
          toast.dismiss(broadcastToast);
          toast.error(`Error: ${e.message}`, { className: "w-[400px]" });
        });
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    }
  };

  return (
    <div className="w-[90vw] mt-36 gap-3 flex flex-col ">
      <ListControl
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
      />

      <div className="flex flex-wrap gap-x-3 gap-y-3 rounded-3xl border-[0] border-gray-100 shadow-[0_7px_24px_0px_rgba(0,0,0,0.25)] shadow-[0] dark:border-gray-900 sm:gap-x-6 sm:gap-y-8 sm:border mb-10">
        {nfts &&
          nfts.map((nft: any) => (
            <GenericNFTCard
              nft={nft}
              key={nft.tokenId}
              onNFTClick={onnNFTClick}
              balance={balance}
              isConnected={status === "Connected"}
            />
          ))}
        {(isFetching || loading) &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => {
            return <GenericNFTCardSkeleton key={i} />;
          })}
      </div>
    </div>
  );
}
