import { useChain } from "@cosmos-kit/react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useConnectedWalletType } from "../hooks/use-connected-wallet-types";
import {
  AccountModal,
  Actions,
  EmbeddedWalletProvider,
} from "@leapwallet/embedded-wallet-sdk-react";

interface Props {
  mounted: boolean;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function EmbeddedWalletContainer({
  mounted,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const { address, openView, disconnect, isWalletConnected, wallet, chain } = useChain("stargaze");
  const walletType = useConnectedWalletType(wallet?.name, isWalletConnected);
  const restURL = chain?.apis?.rest ? chain.apis.rest[0].address : "";
  const chainId = chain?.chain_id || "stargaze-1";

  const navigate = (path: string) => {
    window.open(`https://app.leapwallet.io${path}`);
  };

  const connectWallet = async () => {
    openView();
  };

  const chainData = useMemo(
    () => ({
      [chainId]: {
        address: address ?? "",
        restURL: restURL,
      },
    }),
    [chainId, address, restURL]
  );

  return mounted && isModalOpen && address ? (
    <EmbeddedWalletProvider
      primaryChainId="stargaze-1"
      connectWallet={connectWallet}
      disconnectWallet={disconnect}
      connectedWalletType={walletType}
      chains={["stargaze-1"]}
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
}
