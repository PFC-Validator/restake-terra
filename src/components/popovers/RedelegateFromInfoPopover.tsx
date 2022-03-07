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
  Delegation,
  GenericAuthorization,
  Msg,
  MsgBeginRedelegate,
  MsgGrantAuthorization,
  StakeAuthorization,
  StakeAuthorizationValidators,
  Validator,
} from "@terra-money/terra.js";
import {
  handleRedelegate,
  handleRedelegateAll,
} from "../../modules/redelagation";

type Props = {
  operator: Operator;
  validator: Validator;
  validators: Map<String, Validator>;
  delegations: Map<String, Delegation>;
};
const RedelegateFromInfoPopover: FC<Props> = ({
  operator,
  validators,
  delegations,
  validator,
}) => {
  const wallet = useConnectedWallet();
  const terraAddress = useAddress() || "-none-";

  const amt = "-"; //fromTerraAmount(delegation_amount.toString());
  let validator_list = Array.from(validators.values());

  return (
    <RelegatePopover
      key={"r_from_" + validator.operator_address}
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
                Stake Here
              </Text>
            </Box>
          </Flex>
        </chakra.button>
      )}
    >
      <Flex
        direction="column"
        justify="center"
        key={"rel_from_" + validator.operator_address}
      >
        {validator_list.map((v) => {
          let img = "/validator_default_logo.svg";
          let delgation = delegations.get(v.operator_address);
          let delgation_amt = delgation?.shares || new Dec(0.0);

          if (v.description.identity) {
            img =
              localStorage.getItem(v.description.identity) ||
              "/validator_default_logo.svg";
          }
          if (delgation_amt < new Dec(1)) {
            return <></>;
          } else {
            return (
              <Flex
                flex="1"
                justify="space-between"
                align="center"
                py="2"
                key={
                  "from_o" +
                  validator.operator_address +
                  "_" +
                  v.operator_address
                }
              >
                <HStack flex={1}>
                  <Image src={img} height={19} width={19} />
                  <Text> {v.description.moniker} </Text>
                  <Text> {fromTerraAmount(delgation_amt.toString())} </Text>
                </HStack>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (wallet) {
                      handleRedelegate(
                        terraAddress,
                        v.operator_address,
                        validator.operator_address,
                        operator.botAddress,
                        delgation_amt,
                        wallet
                      );
                    }
                  }}
                >
                  Redelegate
                </Button>
              </Flex>
            );
          }
        })}
        <Text fontSize="sm" align="center" w={"100%"}>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (wallet) {
                let delegation_array = Array.from(delegations.values());
                handleRedelegateAll(
                  terraAddress,
                  validator.operator_address,
                  operator.botAddress,
                  delegation_array,
                  wallet
                );
              }
            }}
          >
            Redelegate ALL to {validator.description.moniker}
          </Button>
        </Text>
      </Flex>

      <Text fontSize="sm" color="black">
        (This will also enroll you in that validators auto-compounder)
      </Text>
    </RelegatePopover>
  );
};

export default RedelegateFromInfoPopover;
