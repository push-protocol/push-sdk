import React from "react";
import ReactDOM from "react-dom";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {configureChains, createConfig, WagmiConfig} from "wagmi";
import {sepolia} from "wagmi/chains";
import {publicProvider} from "wagmi/providers/public";

import App from "./App";
import VideoPage from "./video";

const {chains, publicClient} = configureChains([sepolia], [publicProvider()]);
const {connectors} = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/video", element: <VideoPage />},
]);

ReactDOM.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
