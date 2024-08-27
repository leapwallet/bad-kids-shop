
import { useChain } from "@cosmos-kit/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PiXBold } from "react-icons/pi";
import '@leapwallet/elements-umd-types'

import { useConnectedWalletType } from "../hooks/use-connected-wallet-types";

export const renderLiquidityButton = ({ onClick }: any) => {
  return <button onClick={onClick} id="open-liquidity-modal-btn"></button>;
};

const Modal = ({ show, onClose, children = null }: {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <div id="swap-modal" className="swap-modal-backdrop leap-ui dark" style={{ display: show ? 'flex' : 'none' }}>
      <div className="modal-container">
        <button className="swap-modal-close-button bg-background p-2 rounded-full border shadow" onClick={onClose}>
          <PiXBold />
        </button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ElementsContainer({ isOpen, setIsOpen }: Props) {
  const { openView, isWalletConnected, wallet } = useChain("stargaze");
  const walletType = useConnectedWalletType(wallet?.name, isWalletConnected)
  const [isElementsReady, setIsElementsReady] = useState(false)

  useEffect(() => {
    if (window.LeapElements && isElementsReady) {
      window.LeapElements.mountElements({
        element: {
          name: 'aggregated-swaps',
          props: {
            title: 'Get STARS',
            defaultValues: {
              destinationChainId: 'stargaze-1',
              destinationAsset: 'ustars'
            },
            sourceHeader: 'From',
            destinationHeader: 'To',
            showPoweredByBanner: true,
          }
        },
        elementsRoot: "#swap-modal>.modal-container>.modal-body",
        connectedWalletType: walletType,
        connectWallet: openView,
      });
    }
  }, [walletType, openView, isElementsReady]);

  useEffect(() => {
    if (!window) {
      return;
    }

    if (window.LeapElements) {
      setIsElementsReady(true);
      return;
    }

    const cb = () => {
      setIsElementsReady(true);
    };

    window.addEventListener("@leapwallet/elements:load", cb);

    return () => {
      window.removeEventListener("@leapwallet/elements:load", cb);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}/>
  );
}