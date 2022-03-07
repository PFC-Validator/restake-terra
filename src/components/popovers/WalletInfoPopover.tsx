import React, { FC } from "react";
//import { useRouter } from "next/router";
import copy from "copy-to-clipboard";
import {
  Box,
  chakra,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  useToast,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fromTerraAmount, useAddress, useBalance } from "@arthuryeti/terra";
import { useWallet, useConnectedWallet } from "@terra-money/wallet-provider";

import { truncate } from "utils/text";
import { useTokenInfo } from "modules/common";
import useFinder from "hooks/useFinder";

import WalletPopover from "components/WalletPopover";
import TerraIcon from "components/icons/TerraIcon";
import CopyIcon from "components/icons/CopyIcon";
import ViewIcon from "components/icons/ViewIcon";
import { DEFAULT_CHAIN } from "../../constants/constants";
// import CloseIcon from "components/icons/CloseIcon";

const WalletInfoPopover: FC = () => {
  const { getIcon, getSymbol } = useTokenInfo();
  const { disconnect } = useWallet();
  const wallet = useConnectedWallet();
  const chainID = wallet?.network.chainID || DEFAULT_CHAIN;
  let popover_background = "brand.lightBlue";
  if (chainID !== DEFAULT_CHAIN) {
    popover_background = "brand.testnet";
  }

  const toast = useToast();
  const icon = getIcon("uluna");
  const symbol = getSymbol("uluna");
  const balance = useBalance("uluna");
  const ust_icon = getIcon("uusd");
  const ust_symbol = getSymbol("uusd");
  const ust_balance = useBalance("uusd");
  const terraAddress = useAddress() || "-none-";
  const finder = useFinder();
  // const router = useRouter();

  const copyAddress = () => {
    copy(terraAddress);
    toast({
      title: "Address copied",
      description: "Your Terra address is now in your clipboard",
      status: "info",
      duration: 2000,
      isClosable: false,
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <WalletPopover
      title="In my wallet"
      offset={[-60, -40]}
      triggerElement={() => (
        <chakra.button type="button">
          <Flex color="white" justify="center">
            <Box
              color="white"
              bg={popover_background}
              py="2"
              px="3"
              borderTopLeftRadius="full"
              borderBottomLeftRadius="full"
              mr="0.5"
            >
              <HStack spacing="3">
                <TerraIcon width="1.25rem" height="1.25rem" />
                <Text fontSize="sm" color="white">
                  {wallet && truncate(wallet.terraAddress)}
                </Text>
                {chainID !== DEFAULT_CHAIN && <Text>TESTNET</Text>}
              </HStack>
            </Box>
            <Center
              color="white"
              bg={popover_background}
              py="2"
              px="3"
              borderTopRightRadius="full"
              borderBottomRightRadius="full"
            >
              <HStack spacing="3">
                <Text fontSize="sm" color="white">
                  Luna
                </Text>
                <Text fontSize="sm" color="white">
                  {fromTerraAmount(balance || "0", "0,0.00")}
                </Text>
              </HStack>
            </Center>
          </Flex>
        </chakra.button>
      )}
    >
      <Flex direction="column" justify="center">
        <Flex flex={1} justify="space-between" align="center" py="2">
          <HStack flex={1}>
            <Image boxSize="8" src={icon} alt="" />
            <Box>
              <Text textStyle="h3" lineHeight="1">
                {symbol}
              </Text>
              <Text textStyle="small" variant="dimmed">
                Terra
              </Text>
            </Box>
          </HStack>
          <Flex direction="column" width={1 / 3} gridRowGap={1}>
            <HStack flex={1} justify="space-between">
              <Text flex={1} textStyle="small" variant="dimmed">
                In Wallet:{" "}
              </Text>
              <Text textStyle="small">L {fromTerraAmount(balance || "0")}</Text>
            </HStack>
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" align="center" py="2">
          <HStack flex={1}>
            <Image boxSize="8" src={ust_icon} alt="" />
            <Box>
              <Text textStyle="h3" lineHeight="1">
                {ust_symbol}
              </Text>
              <Text textStyle="small" variant="dimmed">
                Terra
              </Text>
            </Box>
          </HStack>
          <Flex direction="column" width={1 / 3} gridRowGap={1}>
            <HStack flex={1} justify="space-between">
              <Text flex={1} textStyle="small" variant="dimmed">
                In Wallet:{" "}
              </Text>
              <Text textStyle="small">
                $ {fromTerraAmount(ust_balance || "0")}
              </Text>
            </HStack>
          </Flex>
        </Flex>
        <VStack mt={6} align="flex-start">
          <Text textStyle="minibutton">My Address</Text>
          <Text textStyle="small" variant="dimmed">
            {truncate(terraAddress, [16, 16])}
          </Text>
        </VStack>
        <Flex mt={6} justify="space-between">
          <chakra.button onClick={copyAddress}>
            <HStack>
              <CopyIcon width="1.5rem" height="1.5rem" fill="brand.deepBlue" />
              <Text textStyle="small" variant="dimmed">
                Copy Address
              </Text>
            </HStack>
          </chakra.button>
          <Link isExternal href={finder(terraAddress)}>
            <HStack>
              <ViewIcon width="1.5rem" height="1.5rem" fill="brand.deepBlue" />
              <Text textStyle="small" variant="dimmed">
                View on Terra Finder
              </Text>
            </HStack>
          </Link>
        </Flex>
      </Flex>

      <Box mt="6">
        <Button
          type="button"
          variant="primary"
          isFullWidth
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </Box>
      {chainID !== DEFAULT_CHAIN && (
        <Box mt="6" bg={popover_background} color="white">
          <Text align="center">TESTNET</Text>
          <Text align="center">{chainID}</Text>
        </Box>
      )}
    </WalletPopover>
  );
};

export default WalletInfoPopover;
