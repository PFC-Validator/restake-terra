import { useConnectedWallet, useLCDClient } from "@terra-money/wallet-provider";
import React from "react";

import data from "constants/networks.json";
import { useNavigate } from "react-router-dom";

import { useQuery } from "react-query";
import ValidatorList from "../components/ValidatorList";
import { useAddress } from "@arthuryeti/terra";
import { Validator } from "@terra-money/terra.js";
import { Pagination } from "@terra-money/terra.js/dist/client/lcd/APIRequester";

export const Network = () => {
  const lcd = useLCDClient();
  const address = useAddress();
  const fetchValidators = async () => {
    return await lcd.staking.validators({
      "pagination.limit": "200",
      status: "BOND_STATUS_BONDED",
    });
  };
  /*
  const delegatedTo = async () => {
    if (address) {
      return await lcd.staking.bondedValidators(address, {
        "pagination.limit": "200",
      });
    } else {
      return await lcd.staking.bondedValidators("-", {
        "pagination.limit": "200",
      });
    }
  };
  */
  const delegated_details = async () => {
    if (address) {
      return await lcd.staking.delegations(address, undefined, {
        "pagination.limit": "200",
      });
    }
  };
  const reward_details = async () => {
    if (address) {
      return await lcd.distribution.rewards(address, {
        "pagination.limit": "200",
      });
    }
  };

  const validators = useQuery("validators", fetchValidators);
  // const delegations = useQuery("delegations", delegatedTo);
  const delegations = useQuery(
    "delegations" + "-" + (address || "-"),
    delegated_details
  );
  const rewards = useQuery("rewards" + "-" + (address || "-"), reward_details);

  let terra = data.filter((el) => el.name == "terra"); //.reduce((a, v) => ({ ...a, [v.name]: v }), {});
  if (terra.length > 0) {
    const operators = terra[0].operators;

    if (validators.isLoading || delegations?.isLoading) {
      return <div>loading...</div>;
    }
    if (validators.isError) {
      return <div>error (validators)...</div>;
    }
    if (delegations?.isError) {
      return <div>error (delegations)...</div>;
    }
    if (validators.data && delegations?.data) {
      return (
        <ValidatorList
          validators={validators.data[0]}
          operators={operators}
          delegations={delegations.data[0]}
          address={address}
          rewards={rewards.data}
        />
      );
    } else {
      return (
        <div>
          <h1>Couldn't find Terra</h1>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h1>Couldn't find Terra</h1>
      </div>
    );
  }
};
