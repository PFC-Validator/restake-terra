import React, { FC } from "react";
import {
  Flex,
  Text,
  Box,
  HStack,
  Heading,
  Container,
  Link,
  Image,
} from "@chakra-ui/react";

import TerraWallet from "./TerraWallet";
import NavbarLink from "./NavbarLink";

const Navbar: FC = () => {
  return (
    <Container
      maxW="container.xl"
      px={["6", null, "12"]}
      pt="8"
      position="relative"
      centerContent={true}
    >
      <Flex w="100%" justify="space-between" align="center">
        <Box flexShrink="0">
          <Link href="/">
            <Image src="/logo.png" alt="RESTAKE (Terra Edition)" />
          </Link>
        </Box>
        <Box display={["none", null, null, "block"]} flex="1">
          {/*
          <HStack flex="1" px="16" spacing="12">
            <NavbarLink text="Home" href="/" />
          </HStack>
          */}
        </Box>
        <HStack spacing="5" justify="flex-end">
          <TerraWallet />
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
