import { Toaster } from "react-hot-toast";
import { NFTs } from "../components/NFTList";
import { ElementsContainerDynamic, Header } from "../components/Header";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { isValidAddressWithPrefix } from "../config/validateAddress";
import { isMobile } from "react-device-detect";

import CheckOnDesktop from "../public/check-on-desktop.svg";
import Image from "next/image";
import { useChain } from "@cosmos-kit/react";
import {
  AccountModal,
  Actions,
  EmbeddedWalletProvider,
  WalletType,
} from "@leapwallet/embedded-wallet-sdk-react";

export default function Home() {
  const [collection, setCollection] = useState<string | undefined>();
  const router = useRouter();

  const { connect, address, chain, disconnect, isWalletConnected, wallet } = useChain("stargaze");
  const [isElementsModalOpen, setIsElementsModalOpen] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const restURL = chain?.apis?.rest ? [0] && chain?.apis?.rest[0].address : "";
  const chainId = chain?.chain_id || "stargaze-1";
  
  useEffect(() => { 
    setIsModalOpen(false)
  }, [address])

  const ClientAccountModal = () => {
    const ref = useRef();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      ref.current = document.querySelector("body") as unknown as undefined;
      setMounted(true);
    }, []);

    const navigate = (path: string) => {
      window.open(`https://cosmos.leapwallet.io${path}`);
    };

    const chainData = useMemo(() => ({
      [chainId]: {
        address: address ?? "",
        restURL: restURL,
      },
    }), [chainId, address, restURL]);

    return mounted && isModalOpen ? (
      <EmbeddedWalletProvider
      connectWallet={connect}
      disconnectWallet={disconnect}
      connectedWalletType={wallet?.name as WalletType}
      chains={[chainId]}
      >
      <AccountModal
        theme="dark"
        chainRecords={chainData}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        restrictChains={true}
        enableWalletConnect={true}
        config={{
          showActionButtons: true,
          actionListConfig: {
            [Actions.SEND]: {
              onClick: () =>
                navigate(`/transact/send?sourceChainId=${chainId}`),
            },
            [Actions.IBC]: {
              onClick: () =>
                navigate(`/transact/send?sourceChainId=${chainId}`),
            },
            [Actions.SWAP]: {
              onClick: () =>
                navigate(`/transact/swap?sourceChainId=${chainId}`),
            },
            [Actions.BRIDGE]: {
              onClick: () =>
                navigate(`/transact/bridge?destinationChainId=${chainId}`),
            },
            [Actions.BUY]: {
              onClick: () =>
                navigate(`/transact/buy?destinationChainId=${chainId}`),
            },
          },
        }}
      />
      </EmbeddedWalletProvider>
    ) : null;
  };

  useEffect(() => {
    if (typeof router.query.collectionAddress === "string") {
      if (isValidAddressWithPrefix(router.query.collectionAddress, "stars")) {
        setCollection(router.query.collectionAddress);
      }
    }
  }, [router.query]);

  return (
    <>
      {isMobile ? (
        <div className="h-[100vh] w-[100vw] justify-center items-center p-10">
          <Image src={CheckOnDesktop} alt="get stars" className="m-auto" />
        </div>
      ) : (
        <div>
          <Header
            openEmbeddedWalletModal={() => {
              setIsModalOpen(true);
            }}
            setIsElementsModalOpen={setIsElementsModalOpen}
          />
          <div className="px-10 sm:px-14 justify-center align-middle items-center self-center origin-center">
            <NFTs
              setIsElementsModalOpen={setIsElementsModalOpen}
              collection={collection}
            />
            <Toaster position="bottom-right" />
          </div>
          <ClientAccountModal />
          <ElementsContainerDynamic
            isOpen={isElementsModalOpen}
            setIsOpen={setIsElementsModalOpen}
          />
        </div>
      )}
    </>
  );
}
