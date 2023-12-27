import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { chains, assets } from "chain-registry";
import "@interchain-ui/react/styles";
import { ApolloProvider as GraphqlProvider } from "@apollo/client";
import { CosmosCapsuleWallet } from "../leap-social-login/main-wallet";

import { client } from "../config/apolloclient";
import LeapUiTheme, { ThemeName } from "../components/ThemeProvider";
import Head from "next/head";
import { SignerOptions } from "@cosmos-kit/core";
import ConnectWalletSideCurtain from "../components/ConnectWalletSideCurtain/connectWalletSideCurtain";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@leapwallet/elements/styles.css";

if (typeof global.self === "undefined") {
  (global as any).self = global;
}

const updatedChains = chains.map((chain) => {
  if (chain.chain_id === "stargaze-1") {
    return {
      ...chain,
      apis: {
        ...chain.apis,
        rest: [
          { address: "https://leap-node-proxy.numia.xyz/stargaze-lcd" },
        ].concat(chain.apis?.rest ?? []),
        rpc: [
          { address: "https://leap-node-proxy.numia.xyz/stargaze-rpc" },
        ].concat(chain.apis?.rpc ?? []),
      },
    };
  }

  return chain;
});

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    // signingStargate: () => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  const [cosmosCapsuleWallet, setCosmosCapsuleWallet] =
    useState<CosmosCapsuleWallet>();
  const [wallets, setWallets] = useState([])

  
  useEffect(() => {
    const fn = async () => {
      if (!cosmosCapsuleWallet) {
        const WalletClass = await import(
          "../leap-social-login/main-wallet"
        ).then((m) => m.CosmosCapsuleWallet);
        const WalletInfo = await import("../leap-social-login/registry").then(
          (m) => m.LeapCapsuleInfo,
        );
        const cosmosCapsuleWallet = new WalletClass({walletInfo: WalletInfo });
        setCosmosCapsuleWallet(cosmosCapsuleWallet);
        setWallets([
          cosmosCapsuleWallet,
          ...keplrWallets,
          ...leapWallets,
        ]);
      }
    };

    fn();
  });

  if(!cosmosCapsuleWallet) {
    return <>Loading</>
  }
  
  return (
    <>
      <Head>
        <title>Bad Kids Shop</title>
      </Head>

      <GraphqlProvider client={client}>
        <LeapUiTheme defaultTheme={ThemeName.DARK}>
          <ChainProvider
            chains={updatedChains}
            assetLists={assets}
            //@ts-ignore
            walletModal={ConnectWalletSideCurtain}
            //@ts-ignore
            wallets={wallets}
            walletConnectOptions={{
              signClient: {
                projectId: "a8510432ebb71e6948cfd6cde54b70f7",
                relayUrl: "wss://relay.walletconnect.org",
                metadata: {
                  name: "Bad Kids Shop",
                  description: "Bad Kids Shop",
                  url: "https://badkids.shop",
                  icons: [""],
                },
              },
            }}
            signerOptions={signerOptions}
          >
            <Component {...pageProps} />
            {!!cosmosCapsuleWallet && (
                <CustomCapsuleModalViewX/>
            )}
          </ChainProvider>
        </LeapUiTheme>
        p0
      </GraphqlProvider>
    </>
  );
}

export default CreateCosmosApp;


const CCUI = dynamic(
  () =>
    import("@leapwallet/cosmos-social-login-capsule-provider-ui").then(
      (m) => m.CustomCapsuleModalView,
    ),
  { ssr: false },
);


const TransactionSigningModal = dynamic(
  () =>
    import("@leapwallet/cosmos-social-login-capsule-provider-ui").then(
      (m) => m.TransactionSigningModal,
    ),
  { ssr: false },
);

export function CustomCapsuleModalViewX() {
  const [showCapsuleModal, setShowCapsuleModal] = useState(false);

  window.openCapsuleModal = () => {
    setShowCapsuleModal(true);
  }

  return (
    <>
      <CCUI
        showCapsuleModal={showCapsuleModal}
        setShowCapsuleModal={setShowCapsuleModal}
        theme={'dark'}
        onAfterLoginSuccessful={() => {
          window.successFromCapsuleModal();
        }}
        onLoginFailure = {
          () => {
            window.failureFromCapsuleModal();
          }
        }
      />
      <TransactionSigningModal dAppInfo={{name: "Bad Kid"}} />
    </>
  );
}
