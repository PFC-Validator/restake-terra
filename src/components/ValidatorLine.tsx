import React, { useEffect, useState } from "react";
import { Td, Tr, Text, Tooltip, IconButton } from "@chakra-ui/react";
import { Coins, Dec, Delegation, Validator } from "@terra-money/terra.js";
import { FaCheckDouble } from "react-icons/fa";
import { useLCDClient, useWallet } from "@terra-money/wallet-provider";
import { fromTerraAmount } from "@arthuryeti/terra";
import BigNumber from "bignumber.js";
import DelegateButton from "./DelegateButton";
export interface Operator {
  address: string;
  botAddress: string;
  runTime: string;
  minimumReward: number;
}

function calc_rewards(coins: Coins): JSX.Element {
  let luna_bal = coins.get("uluna")?.amount;
  let reward_str = [];
  if (luna_bal && luna_bal > new Dec(1.0)) {
    reward_str.push("Luna " + fromTerraAmount(luna_bal.toString()));
  }
  let uusd_bal = coins.get("uusd")?.amount;
  if (uusd_bal && uusd_bal > new Dec(1.0)) {
    reward_str.push("UST " + fromTerraAmount(uusd_bal.toString()));
  }

  return (
    <ul>
      {reward_str.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export async function identity_to_image(
  identity: string | undefined
): Promise<string> {
  if (!identity) {
    return "/validator_default_logo.svg";
  }
  const imageUrl = localStorage.getItem(identity);
  if (imageUrl) {
    return imageUrl;
  }
  return fetch(
    "https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=" +
      identity
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.them && data.them[0] && data.them[0].pictures) {
        const imageUrl = data.them[0].pictures.primary.url;

        localStorage.setItem(identity, imageUrl);
        return imageUrl;
      }
    });
}
const ValidatorLine: ({
  validator,
  validators,
  operator,
  operators,
  delegation,
  delegations,
  address,
  rewards,
}: {
  validator: Validator;
  validators: Map<string, Validator>;
  operator: Operator | undefined;
  operators: Operator[];
  delegation: Delegation | undefined;
  delegations: Map<string, Delegation>;
  address: string | null;
  rewards: Coins | undefined;
}) => JSX.Element = ({
  validator,
  validators,
  operator,
  operators,
  delegation,
  delegations,
  address,
  rewards,
}) => {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    identity_to_image(validator.description.identity).then((s) => {
      if (s) {
        setImage(s);
      }
    });
  }, [validator.description.identity]);
  useEffect(() => {}, [validator.operator_address, delegation, address]);

  let delegation_balance = delegation?.balance?.amount.toString();
  if (delegation_balance && delegation_balance == "NAN") {
    delegation_balance = undefined;
  }

  return (
    <Tr key={validator.operator_address}>
      <Td>
        <img src={image} alt="validator logo" height={40} width={40} />
      </Td>
      <Td>{validator.description.moniker}</Td>
      <Td align={"center"}>
        {operator && (
          <Tooltip
            hasArrow={true}
            label="This Validator can auto-compound your rewards"
          >
            <IconButton
              aria-label={
                validator.description.moniker +
                " can auto-compound your rewards"
              }
              colorScheme="green"
              icon={<FaCheckDouble />}
            />
          </Tooltip>
        )}
        {!operator && <> </>}
      </Td>
      <Td>{delegation && <>{fromTerraAmount(delegation_balance)}</>}</Td>
      <Td>{rewards && calc_rewards(rewards)}</Td>
      <Td>
        <DelegateButton
          validators={validators}
          operator={operator}
          operators={operators}
          validator={validator}
          delegation={delegation}
          delegations={delegations}
          address={address}
        />
      </Td>
    </Tr>
  );
};

export default ValidatorLine;
