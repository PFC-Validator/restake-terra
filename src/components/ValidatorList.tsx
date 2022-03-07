import React from "react";
import {
  Box,
  Flex,
  HStack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Coins, Delegation, Rewards, Validator } from "@terra-money/terra.js";
import ValidatorLine from "./ValidatorLine";
export interface Operator {
  address: string;
  botAddress: string;
  runTime: string;
  minimumReward: number;
}

// @ts-ignore
const ValidatorList: ({
  validators,
  operators,
  delegations,
  address,
  rewards,
}: {
  validators: Validator[] | undefined;
  operators: Operator[];
  delegations: Delegation[] | undefined;
  rewards: Rewards | undefined;
  address: string | null;
}) => JSX.Element = ({
  validators,
  operators,
  delegations,
  address,
  rewards,
}) => {
  let operator_map = new Map<string, Operator>();
  let delegator_map = new Map<string, Delegation>();
  let validator_operator_map = new Map<string, Validator>();
  let validator_delegator_map = new Map<string, Validator>();
  operators.forEach((op) => operator_map.set(op.address, op));
  (delegations || []).forEach((op) =>
    delegator_map.set(op.validator_address, op)
  );

  if (validators && validators.length > 0) {
    validators.sort((a, b) =>
      a.description.moniker.trim() > b.description.moniker.trim() ? 1 : -1
    );
    let d_validators = validators.filter((v) =>
      delegator_map.has(v.operator_address)
    );
    d_validators.forEach((v) => {
      validator_delegator_map.set(v.operator_address, v);
    });
    let o_validators = validators.filter(
      (v) =>
        !delegator_map.has(v.operator_address) &&
        operator_map.has(v.operator_address)
    );
    o_validators.forEach((v) => {
      validator_operator_map.set(v.operator_address, v);
    });
    /*
    let rest_validators = validators.filter(
      (v) =>
        !delegator_map.has(v.operator_address) &&
        !operator_map.has(v.operator_address)
    );

     */

    return (
      <HStack justify="space-between" align="center">
        <Box></Box>
        <Flex w="75%" justify="space-between" align="center">
          <Box>
            <Table width="100%">
              <Thead>
                <Tr>
                  <Th colSpan={2}>Validator</Th>
                  <Th>Re-Stake</Th>
                  <Th>Delegation</Th>
                  <Th colSpan={2}>Rewards</Th>
                </Tr>
              </Thead>
              <Tbody>
                {d_validators.map((validator) => (
                  <ValidatorLine
                    key={validator.operator_address}
                    validator={validator}
                    validators={validator_operator_map}
                    operator={operator_map.get(validator.operator_address)}
                    operators={operators}
                    delegation={delegator_map.get(validator.operator_address)}
                    delegations={delegator_map}
                    address={address}
                    rewards={rewards?.rewards[validator.operator_address]}
                  />
                ))}
                {o_validators.map((validator) => (
                  <ValidatorLine
                    key={validator.operator_address}
                    validator={validator}
                    validators={validator_delegator_map}
                    operator={operator_map.get(validator.operator_address)}
                    operators={operators}
                    delegation={delegator_map.get(validator.operator_address)}
                    delegations={delegator_map}
                    address={address}
                    rewards={rewards?.rewards[validator.operator_address]}
                  />
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </HStack>
    );
  } else {
    // eslint-disable-next-line no-console
    console.log("validatorList: validators undefined/empty");
    return <></>;
  }
};

export default ValidatorList;
