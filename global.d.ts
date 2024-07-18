interface Window {
  LeapElements: {
    RenderElements: (options: { 
      integratedTargetId: string,
      connectWallet?: () => void,
      connectedWalletType?: any,
      displayMode: string 
    }) => void;
    WalletType: any;
  };
}