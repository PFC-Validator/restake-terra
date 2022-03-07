import { useCallback } from "react";

import { DEFAULT_CHAIN, FINDER } from "constants/constants";
import { useWallet } from "@terra-money/wallet-provider";

const useFinder = () => {
  const wallet = useWallet();
  const chainID = wallet?.network.chainID || DEFAULT_CHAIN;

  return useCallback(
    (address: string, path: string = "account") => {
      return `${FINDER}/${chainID}/${path}/${address}`;
    },
    [chainID]
  );
};

export default useFinder;
