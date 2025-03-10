import { useChain } from "@cosmos-kit/react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useConnectedWalletType } from "../hooks/use-connected-wallet-types";
import {
  Actions,
  EmbeddedWalletProvider,
  StickyAggregatedView
} from "@leapwallet/embedded-wallet-sdk-react";

interface Props {
  mounted: boolean;
  isModalOpen?: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function EmbeddedWalletContainer({
  mounted,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const { address, openView, disconnect, isWalletConnected, wallet, chain } = useChain("stargaze");
  const walletType = useConnectedWalletType(wallet?.name, isWalletConnected);
  const restURL = chain?.apis?.rest ? chain.apis.rest[1].address : "";
  const chainId = chain?.chain_id || "stargaze-1";

  const navigate = (path: string) => {
    window.open(`https://swapfast.app${path}`);
  };

  const connectWallet = async () => {
    openView();
  };

  const chainData = useMemo(
    () => ({
      [chainId]: {
        address: address ?? "",
        restURL: restURL,
        chainType: "cosmos",
      },
    }),
    [chainId, address, restURL]
  );

  const connectedWalletList = useMemo(() => {
    if (isWalletConnected) {
      return [{
        type: 'cosmos' as any,
        address: address ?? "",
        prettyName: wallet?.prettyName || "",
        logoUrl: typeof wallet?.logo === 'string' ? wallet.logo : "",
      }];
    }
    return [];
  }, [wallet, isWalletConnected, address]);

  return mounted && address ? (
    <EmbeddedWalletProvider
      primaryChainId="stargaze-1"
      connectWallet={connectWallet}
      disconnectWallet={disconnect}
      connectedWalletType={walletType}
      chains={["stargaze-1"]}
    >
       <StickyAggregatedView
        theme="dark"
        chainRecords={chainData}
        onClose={() => {
          setIsModalOpen(false);
        }}
        restrictChains={true}
        connectedWalletList={connectedWalletList}
        config={{
          showActionButtons: true,
          showWalletList: true,
          actionListConfig: {
            [Actions.SEND]: {
              enabled: false,
            },
            [Actions.IBC]: {
              enabled: false,
            },
            [Actions.SWAP]: {
              onClick: () =>
                navigate(`?sourceChainId=${chainId}}`),
            },
            [Actions.BRIDGE]: {
              onClick: () =>
                navigate(`?destinationChainId=${chainId}`),
            },
            [Actions.BUY]: {
              onClick: () =>
                navigate(`?destinationChainId=${chainId}`),
            },
          },
        }}
      />
    </EmbeddedWalletProvider>
  ) : null;
}
