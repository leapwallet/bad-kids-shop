
import { useChain } from "@cosmos-kit/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useConnectedWalletType } from "../hooks/use-connected-wallet-types";

export const renderLiquidityButton = ({ onClick }: any) => {
  return <button onClick={onClick} id="open-liquidity-modal-btn"></button>;
};

const Modal = ({ show, onClose, children }: {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="swap-modal-backdrop leap-ui dark" style={{ display: show ? 'flex' : 'none' }}>
      <div className="modal-container">
        <button className="swap-modal-close-button" onClick={onClose}>X</button>
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
  const { address, openView, isWalletConnected, wallet } = useChain("stargaze");
  const walletType = useConnectedWalletType(wallet?.name, isWalletConnected)

  useEffect(() => {
    if (window.LeapElements) {
    const { RenderElements } = window.LeapElements;
    RenderElements({
      integratedTargetId: 'leap-elements-widget',
      displayMode: "aggregated-swaps-view",
      connectWallet: async () => {
          openView();
      },
      connectedWalletType: walletType,
      title: 'Get STARS',
      defaultValues: {
        destinationChainId: 'stargaze-1',
        destinationAsset: 'ustars'
      },
      sourceHeader: 'From',
      destinationHeader: 'To',
      showPoweredByBanner: true,
      txnLifecycleHooks: {
        onTxnSignInit: (txn: any) => {
          console.log('onTxnSignInit', txn);
        },
        onTxnSignApproved: (txn: any) => {
          console.log('onTxnSignApproved', txn);
        },
        onTxnSignFailed: (txn: any, err: any) => {
          console.log('onTxnSignFailed', txn, err);
        },
        onTxnComplete: (summary: any) => {
          console.log('onTxnComplete', summary);
        },
        onTxnInProgress: (tab: any) => {
          console.log('onTxnInProgress', tab);
          return () => {
            console.log('onTxnInProgress cleanup');
          };
        },
        onTxnReview: (txn: any) => {
          console.log('onTxnReview', txn);
        },
        onTxnBeginTracking: (txn: any) => {
          console.log('onTxnBeginTracking', txn);
        }
      } 
    });
  }
  }, [walletType, openView]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <div id="leap-elements-widget"></div>
    </Modal>  
  );
}
