import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { chains, assets } from "chain-registry";
import "@interchain-ui/react/styles";
import { ApolloProvider as GraphqlProvider } from "@apollo/client";

import { client } from "../config/apolloclient";
import LeapUiTheme, { ThemeName } from "../components/ThemeProvider";
import Head from "next/head";
import { SignerOptions } from "@cosmos-kit/core";
import ConnectWalletSideCurtain from "../components/ConnectWalletSideCurtain/connectWalletSideCurtain";

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
            wallets={[...keplrWallets, ...leapWallets]}
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
          </ChainProvider>
        </LeapUiTheme>
        p0
      </GraphqlProvider>
    </>
  );
}

export default CreateCosmosApp;
