import "../styles/globals.css";
import "@leapwallet/embedded-wallet-sdk-react/styles.css";
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";
import "@leapwallet/react-ui/styles.css";

import type { AppProps } from "next/app";
import { ChainProvider, useChain } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { chains, assets } from "chain-registry";
import "@interchain-ui/react/styles";
import { ApolloProvider as GraphqlProvider } from "@apollo/client";
import { LeapCapsuleWallet } from "@cosmos-kit/leap-capsule-social-login";

import { client } from "../config/apolloclient";
import LeapUiTheme, { ThemeName } from "../components/ThemeProvider";
import Head from "next/head";
import { SignerOptions, Wallet } from "@cosmos-kit/core";
import ConnectWalletSideCurtain from "../components/ConnectWalletSideCurtain/connectWalletSideCurtain";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
          {
            address:
              process.env.NEXT_PUBLIC_NODE_REST_ENDPOINT ||
              "https://rest.stargaze-apis.com/",
          },
        ].concat(chain.apis?.rest ?? []),
        rpc: [
          {
            address:
              process.env.NEXT_PUBLIC_NODE_REST_ENDPOINT ||
              "https://rpc.stargaze-apis.com/",
          },
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
    useState<LeapCapsuleWallet>();
  const [wallets, setWallets] = useState();

  useEffect(() => {
    const fn = async () => {
      if (!cosmosCapsuleWallet) {
        const WalletClass = await import(
          "@cosmos-kit/leap-capsule-social-login"
        ).then((m) => m.LeapCapsuleWallet);
        const WalletInfo: Wallet = await import(
          "../leap-social-login/registry"
        ).then((m) => m.LeapCapsuleInfo);
        const cosmosCapsuleWallet = new WalletClass(WalletInfo);
        setCosmosCapsuleWallet(cosmosCapsuleWallet);
        // @ts-ignore: Disabling typecheck until we figureout proper way of adding cosmoscapsulewallet in cosmos-kit
        setWallets([cosmosCapsuleWallet, ...keplrWallets, ...leapWallets]);
      }
    };

    fn();
  });

  if (!cosmosCapsuleWallet) {
    return <>Loading</>;
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
                projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
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
            {!!cosmosCapsuleWallet && <CustomCapsuleModalViewX />}
          </ChainProvider>
        </LeapUiTheme>
      </GraphqlProvider>
    </>
  );
}

export default CreateCosmosApp;

const CCUI = dynamic(
  () =>
    import("@leapwallet/cosmos-social-login-capsule-provider-ui").then(
      (m) => m.CustomCapsuleModalView
    ),
  { ssr: false }
);

const TransactionSigningModal = dynamic(
  () =>
    import("@leapwallet/cosmos-social-login-capsule-provider-ui").then(
      (m) => m.TransactionSigningModal
    ),
  { ssr: false }
);

export function CustomCapsuleModalViewX() {
  const [showCapsuleModal, setShowCapsuleModal] = useState(false);
  const [oAuthMethods, setOAuthMethods] = useState<Array<any>>([])

  useEffect(() => {
    import("@leapwallet/cosmos-social-login-capsule-provider").then((capsuleProvider) => {
      setOAuthMethods([capsuleProvider.OAuthMethod.GOOGLE, capsuleProvider.OAuthMethod.FACEBOOK, capsuleProvider.OAuthMethod.TWITTER])
    })
  }, [])

  return (
    <div className="leap-ui dark">
      <CCUI
        showCapsuleModal={showCapsuleModal}
        setShowCapsuleModal={setShowCapsuleModal}
        theme={"dark"}
        onAfterLoginSuccessful={() => {
          window.successFromCapsuleModal();
        }}
        onLoginFailure={
          () => {
            window.failureFromCapsuleModal();
          }
        }
        oAuthMethods={oAuthMethods}
      />
      <TransactionSigningModal dAppInfo={{ name: "Bad Kids Shop" }} />
    </div>
  );
}
