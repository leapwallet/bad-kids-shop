import { WalletType } from '@leapwallet/elements';
import { useMemo } from 'react';

export const useConnectedWalletType = (
  walletName: string | undefined,
  isWalletConnected: boolean
) => {
  const connectedWallet: WalletType | undefined = useMemo(() => {
    if (!isWalletConnected) {
      return undefined;
    }
    switch (walletName) {
      case 'leap-extension':
        return WalletType.LEAP;
      case 'keplr-extension':
        return WalletType.KEPLR;
      case 'leap-cosmos-mobile':
        return WalletType.WC_LEAP_MOBILE;
      case 'keplr-cosmos-mobile':
        return WalletType.WC_KEPLR_MOBILE;
      case 'leap-metamask-cosmos-snap':
        return WalletType.METAMASK_SNAP_LEAP;
      case 'leap-capsule-social-login':
        return WalletType.CAPSULE;
      default:
        return undefined;
    }
  }, [isWalletConnected, walletName]);

  return connectedWallet;
};
