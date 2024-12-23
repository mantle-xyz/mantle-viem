import type { Client, Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";
import {
	depositERC20,
	type DepositERC20Parameters,
	type DepositERC20ReturnType,
} from "../actions/depositERC20.js";
import {
	depositETH,
	type DepositETHParameters,
	type DepositETHReturnType,
} from "../actions/depositETH.js";
import {
	depositMNT,
	type DepositMNTParameters,
	type DepositMNTReturnType,
} from "../actions/depositMNT.js";
import {
	finalizeWithdrawal,
	type FinalizeWithdrawalParameters,
	type FinalizeWithdrawalReturnType,
} from "../actions/finalizeWithdrawal.js";
import {
	proveWithdrawal,
	type ProveWithdrawalParameters,
	type ProveWithdrawalReturnType,
} from "../actions/proveWithdrawal.js";

export type WalletActionsL1<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
> = {
	depositMNT: <chainOverride extends Chain | undefined = Chain | undefined>(
		args: DepositMNTParameters<chain, account, chainOverride>,
	) => Promise<DepositMNTReturnType>;
	depositERC20: <chainOverride extends Chain | undefined = Chain | undefined>(
		args: DepositERC20Parameters<chain, account, chainOverride>,
	) => Promise<DepositERC20ReturnType>;
	depositETH: <chainOverride extends Chain | undefined = Chain | undefined>(
		args: DepositETHParameters<chain, account, chainOverride>,
	) => Promise<DepositETHReturnType>;
	finalizeWithdrawal: <chainOverride extends Chain | undefined = undefined>(
		parameters: FinalizeWithdrawalParameters<chain, account, chainOverride>,
	) => Promise<FinalizeWithdrawalReturnType>;
	proveWithdrawal: <chainOverride extends Chain | undefined = undefined>(
		parameters: ProveWithdrawalParameters<chain, account, chainOverride>,
	) => Promise<ProveWithdrawalReturnType>;
};

export function walletActionsL1() {
	return <
		transport extends Transport,
		chain extends Chain | undefined = Chain | undefined,
		account extends Account | undefined = Account | undefined,
	>(
		client: Client<transport, chain, account>,
	): WalletActionsL1<chain, account> => {
		return {
			depositMNT: (args) => depositMNT(client, args),
			depositERC20: (args) => depositERC20(client, args),
			depositETH: (args) => depositETH(client, args),
			finalizeWithdrawal: (args) => finalizeWithdrawal(client, args),
			proveWithdrawal: (args) => proveWithdrawal(client, args),
		};
	};
}
