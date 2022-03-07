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
} from "@terra-money/terra.js";
import { ConnectedWallet, TxResult } from "@terra-money/wallet-provider";

export function build_redelegate(
  address: string,
  from: string,
  to: string,
  amount: Dec
): Msg {
  return new MsgBeginRedelegate(address, from, to, new Coin("uluna", amount));
}

export function build_grants(
  address: string,
  botAddress: string,
  to: string,
  expiration: Date
): Msg[] {
  let stakeAuth = new StakeAuthorization(
    1,
    undefined,
    new StakeAuthorizationValidators([to]),
    new StakeAuthorizationValidators([])
  );

  let stake = new MsgGrantAuthorization(
    address,
    botAddress,
    new AuthorizationGrant(stakeAuth, expiration)
  );
  let genericAuth = new GenericAuthorization(
    "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
  );
  let withdrawReward = new MsgGrantAuthorization(
    address,
    botAddress,
    new AuthorizationGrant(genericAuth, expiration)
  );

  return [stake, withdrawReward];
}

export function build_redelegate_and_auth(
  address: string,
  from: string,
  to: string,
  botAddress: string,
  amount: Dec,
  expiration: Date
): Msg[] {
  if (!address) {
    console.log("build_redelgate_and_auth - address not found");
  }
  let messages: Msg[] = [];

  messages.push(build_redelegate(address, from, to, amount));
  build_grants(address, botAddress, to, expiration).forEach((msg) => {
    messages.push(msg);
  });

  return messages;
}

export function handleRedelegate(
  address: string,
  from: string,
  to: string,
  bot: string,
  amount: Dec,
  wallet: ConnectedWallet
) {
  const dateNow = new Date();
  const expiration = new Date(
    dateNow.getFullYear() + 1,
    dateNow.getMonth(),
    dateNow.getDate()
  );
  if (from.startsWith("terra") && to.startsWith("terra") && wallet) {
    let messages = build_redelegate_and_auth(
      address,
      from,
      to,
      bot,
      amount,
      expiration
    );
    return wallet
      .post({ msgs: messages })
      .then((txResult: TxResult) => {
        console.log("tx", txResult);
      })
      .catch((reason) => {
        console.log("error", reason);
      });
  }
}
export function handleRedelegateAll(
  address: string,

  to: string,
  bot: string,
  delegations: Delegation[],
  wallet: ConnectedWallet
) {
  const dateNow = new Date();
  const expiration = new Date(
    dateNow.getFullYear() + 1,
    dateNow.getMonth(),
    dateNow.getDate()
  );
  let messages: Msg[] = [];
  delegations.forEach((delegation) => {
    messages.push(
      build_redelegate(
        address,
        delegation.validator_address,
        to,
        delegation.shares
      )
    );
  });
  build_grants(address, bot, to, expiration).forEach((msg) => {
    messages.push(msg);
  });
  return wallet
    .post({ msgs: messages })
    .then((txResult: TxResult) => {
      console.log("tx", txResult);
    })
    .catch((reason) => {
      console.log("error", reason);
    });
}
