import { useWallet } from "@terra-money/wallet-provider";
import React, {
  Consumer,
  Context,
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { Data, Tokens } from "./types";

type RestakeTerra = {
  tokens: Tokens | null;
  data: Data | null;
};

export const RestakeTerraAppContext: Context<RestakeTerra> =
  createContext<RestakeTerra>({
    tokens: null,
    data: null,
  });

type Props = {
  children: ReactNode;
  data: Data;
};

export const RestakeTerraAppProvider: FC<Props> = ({ children, data }) => {
  const {
    network: { name },
  } = useWallet();

  const tokens = useMemo(() => {
    return data[name].tokens;
  }, [name, data]);

  return (
    <RestakeTerraAppContext.Provider
      value={{
        tokens,
        data,
      }}
    >
      {children}
    </RestakeTerraAppContext.Provider>
  );
};

export function useRestakeTerraApp(): RestakeTerra {
  return useContext(RestakeTerraAppContext);
}

export const RestakeTerraAppConsumer: Consumer<RestakeTerra> =
  RestakeTerraAppContext.Consumer;
