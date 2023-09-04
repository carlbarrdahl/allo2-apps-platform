import { type AppType } from "next/dist/shared/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimismGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "~/styles/globals.css";

const { chains, publicClient } = configureChains(
  [optimismGoerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Allo2 App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />{" "}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;
