import React, { FC, useCallback } from "react";
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
import {
  useWallet,
  useConnectedWallet,
  TxResult,
  ConnectedWallet,
} from "@terra-money/wallet-provider";

import RelegatePopover from "components/RelegatePopover";

import { Operator } from "../ValidatorLine";
import {
  AuthorizationGrant,
  Coin,
  Dec,
  GenericAuthorization,
  Msg,
  MsgBeginRedelegate,
  MsgGrantAuthorization,
  StakeAuthorization,
  StakeAuthorizationValidators,
  Validator,
} from "@terra-money/terra.js";
import { handleRedelegate } from "../../modules/redelagation";

type Props = {
  operators: Operator[];
  validator: Validator;
  validators: Map<String, Validator>;
  delegation_amount: Dec;
};
const RedelegateToInfoPopover: FC<Props> = ({
  operators,
  validators,
  delegation_amount,
  validator,
}) => {
  const wallet = useConnectedWallet();
  const terraAddress = useAddress() || "-none-";

  const amt = fromTerraAmount(delegation_amount.toString());

  return (
    <RelegatePopover
      key={"r_to_" + validator.operator_address}
      title={"Move your " + amt + " Luna stake to .."}
      offset={[-60, -40]}
      triggerElement={() => (
        <chakra.button type="button">
          <Flex color="white" justify="center">
            <Box
              color="white"
              bg="brand.lightBlue"
              py="2"
              px="3"
              borderTopLeftRadius="full"
              borderBottomLeftRadius="full"
              borderTopRightRadius="full"
              borderBottomRightRadius="full"
              mr="0.5"
            >
              <Text fontSize="sm" color="white">
                Move Stake
              </Text>
            </Box>
          </Flex>
        </chakra.button>
      )}
    >
      <Flex
        direction="column"
        justify="center"
        key={"to_oo" + validator.operator_address}
      >
        {operators.map((o) => {
          let v = validators.get(o.address);
          let img = "/validator_default_logo.svg";
          if (v) {
            if (v.description.identity) {
              img =
                localStorage.getItem(v.description.identity) ||
                "/validator_default_logo.svg";
            }
            return (
              <Flex
                flex="1"
                justify="space-between"
                align="center"
                py="2"
                key={"to_o" + validator.operator_address + "_" + o.address}
              >
                <HStack flex={1}>
                  <Image src={img} height={19} width={19} />
                  <Text> {v.description.moniker} </Text>
                </HStack>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (wallet) {
                      handleRedelegate(
                        terraAddress,
                        validator.operator_address,
                        o.address,
                        o.botAddress,
                        delegation_amount,
                        wallet
                      );
                    }
                  }}
                >
                  Redelegate
                </Button>
              </Flex>
            );
          } else {
            return <></>;
          }
        })}
      </Flex>
      <Text fontSize="sm" color="black">
        (This will also enroll you in that validators auto-compounder)
      </Text>
    </RelegatePopover>
  );
};

export default RedelegateToInfoPopover;
