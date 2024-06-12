import { SwapsModal, ElementsProvider } from "@leapwallet/elements";

import { useChain } from "@cosmos-kit/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useConnectedWalletType } from "../hooks/use-connected-wallet-type";
import { walletConnectOptions } from "../config/wallet-connect";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ElementsContainer({ isOpen, setIsOpen }: Props) {
  const { openView, wallet, isWalletConnected } = useChain("stargaze");
  const connectedWalletType = useConnectedWalletType(
    wallet?.name,
    isWalletConnected
  );

  useEffect(() => {
    const elementsModal = document.querySelector(".leap-ui");
    if (elementsModal) {
      //@ts-ignore
      elementsModal.style["zIndex"] = 11;
    }
  }, []);

  return (
    <div className="fixed z-99 leap-ui dark">
      <ElementsProvider
        primaryChainId="stargaze-1"
        connectWallet={openView}
        connectedWalletType={connectedWalletType}
        walletConnectOptions={walletConnectOptions}
      >
        <SwapsModal
          isOpen={isOpen}
          title="Get STARS"
          setIsOpen={setIsOpen}
          defaultValues={{
            destinationChainId: "stargaze-1",
            destinationAsset: "ustars"
          }}
        />
      </ElementsProvider>
    </div>
  );
}
