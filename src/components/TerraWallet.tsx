import React, { FC } from "react";
import {
  useWallet,
  WalletStatus,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { fromTerraAmount, useBalance } from "@arthuryeti/terra";
import { Text, HStack, useDisclosure, Box, Button } from "@chakra-ui/react";

import WalletModal from "./WalletModal";
import WalletInfoPopover from "./popovers/WalletInfoPopover";

const TerraWallet: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status, disconnect } = useWallet();
  const wallet = useConnectedWallet();

  if (status === WalletStatus.WALLET_CONNECTED && wallet) {
    return <WalletInfoPopover />;
  }

  return (
    <>
      <Button type="button" onClick={onOpen}>
        Connect your wallet
      </Button>
      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default TerraWallet;
