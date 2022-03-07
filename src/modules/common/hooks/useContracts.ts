import { useMemo } from "react";
import { useWallet } from "@terra-money/wallet-provider";

type Contracts = {
  // TODO
  fundFactory: string;
};

type Networks = {
  mainnet: Contracts;
  testnet: Contracts;
};

const defaultContracts: Networks = {
  mainnet: {
    fundFactory: "terra1u3uxd530nd62gjerwlsth08x776fej3eeer3vd",
  },
  testnet: {
    fundFactory: "terra1vd04tm25d4r0uey38d6v870ehpdsptdrxpxpqw",
  },
};

export const useContracts = (initial?: Networks): Contracts => {
  const {
    network: { name },
  } = useWallet();
  const contracts = initial ?? defaultContracts;

  return useMemo(() => {
    // @ts-ignore
    return contracts[name];
  }, [contracts, name]);
};

export default useContracts;
