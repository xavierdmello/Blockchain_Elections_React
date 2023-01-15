import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";

import { configureChains, createClient, WagmiConfig } from "wagmi";

import { avalancheFuji } from "wagmi/chains";

const chains = [avalancheFuji];

// Wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: "4e133e46b7d4ce91f051d09546ec365f" })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "Elections Canada", chains }),
  provider,
});

const chainImages = {
  43113: "./avax.svg",
};

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>

    <Web3Modal projectId="4e133e46b7d4ce91f051d09546ec365f" ethereumClient={ethereumClient} chainImages={chainImages} themeColor="magenta" themeMode="light" />
  </React.StrictMode>
);
