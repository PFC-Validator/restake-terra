import React, { FC } from "react";
import { Button } from "@chakra-ui/react";
import { Operator } from "./ValidatorLine";
import { Coins, Delegation, Validator } from "@terra-money/terra.js";

import RedelegateToInfoPopover from "./popovers/RedelegateToInfoPopover";
import RedelegateFromInfoPopover from "./popovers/RedelegateFromInfoPopover";

type Props = {
  operator: Operator | undefined;
  operators: Operator[];
  validator: Validator;
  validators: Map<String, Validator>;
  delegations: Map<String, Delegation>;
  delegation: Delegation | undefined;
  address: string | null;
};

const DelegateButton: FC<Props> = ({
  operator,
  operators,
  validator,
  validators,
  delegations,
  delegation,
  address,
}) => {
  if (!address) {
    return <></>;
  }
  if (delegation && operator) {
    return <>TBD-Check Grant</>;
  }
  if (delegation) {
    return (
      <RedelegateToInfoPopover
        key={"tv" + validator.operator_address}
        validator={validator}
        operators={operators}
        validators={validators}
        delegation_amount={delegation.shares}
      />
    );
  }
  if (operator) {
    return (
      <RedelegateFromInfoPopover
        key={"fv" + validator.operator_address}
        validator={validator}
        operator={operator}
        validators={validators}
        delegations={delegations}
      />
    );
  }
  return <></>;
};

export default DelegateButton;
