import type { Client, Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";
import {
	initiateERC20Withdrawal,
	type InitiateERC20WithdrawalParameters,
	type InitiateERC20WithdrawalReturnType,
} from "../actions/initiateERC20Withdrawal.js";
import {
	initiateETHWithdrawal,
	type InitiateETHWithdrawalParameters,
	type InitiateETHWithdrawalReturnType,
} from "../actions/initiateETHWithdrawal.js";
import {
	initiateMNTWithdrawal,
	type InitiateMNTWithdrawalParameters,
	type InitiateMNTWithdrawalReturnType,
} from "../actions/initiateMNTWithdrawal.js";

export type WalletActionsL2<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
> = {
	initiateMNTWithdrawal: <chainOverride extends Chain | undefined = undefined>(
		parameters: InitiateMNTWithdrawalParameters<chain, account, chainOverride>,
	) => Promise<InitiateMNTWithdrawalReturnType>;
	initiateETHWithdrawal: <chainOverride extends Chain | undefined = undefined>(
		parameters: InitiateETHWithdrawalParameters<chain, account, chainOverride>,
	) => Promise<InitiateETHWithdrawalReturnType>;
	initiateERC20Withdrawal: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: InitiateERC20WithdrawalParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<InitiateERC20WithdrawalReturnType>;
};

export function walletActionsL2() {
	return <
		transport extends Transport,
		chain extends Chain | undefined = Chain | undefined,
		account extends Account | undefined = Account | undefined,
	>(
		client: Client<transport, chain, account>,
	): WalletActionsL2<chain, account> => {
		return {
			initiateMNTWithdrawal: (args) => initiateMNTWithdrawal(client, args),
			initiateETHWithdrawal: (args) => initiateETHWithdrawal(client, args),
			initiateERC20Withdrawal: (args) => initiateERC20Withdrawal(client, args),
		};
	};
}
