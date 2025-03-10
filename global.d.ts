interface Window {
  LeapElements: {
    RenderElements: (options: { 
      integratedTargetId: string,
      connectWallet?: () => void,
      connectedWalletType?: any,
      displayMode: string,
      title?: string,
      defaultValues?: {
        destinationChainId?: string,
        destinationAsset?: string
        sourceChainId?: string,
        sourceAsset?: string
      } 
      sourceHeader?: string,
      destinationHeader?: string
      showPoweredByBanner?: boolean
      allowedSourceChains?: any[]
      txnLifecycleHooks?: TxnLifecycleHooks
    }) => void;
    WalletType: any;
  };
  leap?: any;
  keplr: any;
  cosmostation?: any;
}

type TxnLifecycleHooks<K> = {
  onTxnSignInit: (txn: TxnSignInitArgs) => void
  onTxnSignApproved: (txn: TxnSignApprovedArgs) => void
  onTxnSignFailed: (txn: TxnSignFailedArgs, err: Error) => void
  onTxnComplete: (summary: K) => void
  onTxnInProgress: (tab: Tabs) => () => void
  onTxnReview: (txn: TxnReviewArgs) => void
  onTxnBeginTracking: (txn: TxnReviewArgs) => void
}