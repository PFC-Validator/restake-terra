import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import {
  getChainOptions,
  StaticWalletProvider,
  WalletProvider,
} from "@terra-money/wallet-provider";
import App from "./app";

getChainOptions().then((chainOptions) => {
  if (typeof window !== "undefined") {
    ReactDOM.hydrate(
      <WalletProvider {...chainOptions}>
        <App />
      </WalletProvider>,
      document.getElementById("root")
    );
  } else {
    ReactDOM.hydrate(
      <StaticWalletProvider {...chainOptions}>
        <App />
      </StaticWalletProvider>,
      document.getElementById("root")
    );
  }
});
