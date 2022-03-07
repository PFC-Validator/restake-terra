import React, { FC } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";

import whitelist from "constants/whitelist.json";
import Navbar from "./Navbar";
import { Global } from "@emotion/react";
import { RestakeTerraAppProvider } from "../modules/common";

const Layout: FC = ({ children }) => {
  const wallet = useWallet();
  const isInitializing = wallet.status == WalletStatus.INITIALIZING;

  if (isInitializing) {
    return null;
  }

  return (
    <Flex height="100vh" direction="column">
      <Global
        styles={{
          "html,body": {
            // height: "100%",
            width: "100%",
            overflowX: "hidden",
            position: "relative",
          },
          body: {
            backgroundColor: "#000D37",
            color: "#fff",
          },
          "*::-webkit-scrollbar": {
            width: "6px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#5643F2",
            borderRadius: "6px",
          },
          "#chakra-toast-manager-bottom-right": {
            right: "32px!important",
            bottom: "32px!important",
          },
          "@font-face": {
            fontFamily: "Roboto",
            fontWeight: 400,
            src: "url('/roboto-v29-latin-regular.woff2') format('woff2')",
          },
        }}
      />
      <Box>
        {!isInitializing && (
          <RestakeTerraAppProvider data={whitelist}>
            <Box>
              <Navbar />
            </Box>
            <Box flex="1">{children}</Box>
          </RestakeTerraAppProvider>
        )}
        {isInitializing && <>Loading ...</>}
      </Box>
    </Flex>
  );
};

export default Layout;
