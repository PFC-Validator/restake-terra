import { useMemo } from "react";
import { Button } from "@chakra-ui/react";
import { MsgExecuteContract, Coin } from "@terra-money/terra.js";
import {
  toTerraAmount,
  useAddress,
  useEstimateFee,
  useTx,
} from "@arthuryeti/terra";
import Layout from "../components/Layout";

export default function Web() {
  const address = useAddress() || "-";

  const msgs = useMemo(() => {
    const coins = [new Coin("uusd", toTerraAmount(2))];

    return [
      new MsgExecuteContract(
        address,
        "terra1mxy8lmf2jeyr7js7xvm046fssyfa5a9pm78fpn",
        {
          swap: {
            offer_asset: {
              info: {
                native_token: {
                  denom: "uusd",
                },
              },
              amount: toTerraAmount(2),
            },
          },
        },
        coins
      ),
    ];
  }, []);

  const { fee, isLoading, error } = useEstimateFee({
    msgs,
  });

  if (error) {
    console.log("error", error);
  }

  const { submit } = useTx({
    onPosting: () => {
      console.log("onPosting");
    },
    onBroadcasting: () => {
      console.log("onBroadcasting");
    },
    onError: () => {
      console.log("onError");
    },
  });

  const handleClick = () => {
    submit({
      msgs,
      // @ts-ignore
      fee,
    });
  };

  return (
    <div>
      <Button
        variant="primary"
        type="button"
        onClick={handleClick}
        isDisabled={fee == null}
        isLoading={isLoading}
      >
        Submit tx
      </Button>
    </div>
  );
}
