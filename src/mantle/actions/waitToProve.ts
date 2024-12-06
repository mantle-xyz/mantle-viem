import type {
	Account,
	Chain,
	Client,
	DeriveChain,
	GetChainParameter,
	TransactionReceipt,
	Transport,
} from "viem";
import type { OneOf } from "viem";
import type { ErrorType } from "../errors/utils.js";
import { ReceiptContainsNoWithdrawalsError } from "../errors/withdrawal.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { Withdrawal } from "../types/withdrawal.js";
import {
	getWithdrawals,
	type GetWithdrawalsErrorType,
} from "../utils/getWithdrawals.js";
import {
	waitForNextL2Output,
	type WaitForNextL2OutputErrorType,
	type WaitForNextL2OutputParameters,
	type WaitForNextL2OutputReturnType,
} from "./waitForNextL2Output.js";

export type WaitToProveParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	OneOf<
		| GetContractAddressParameter<_derivedChain, "l2OutputOracle">
		| GetContractAddressParameter<_derivedChain, "portal">
	> & {
		receipt: TransactionReceipt;
		/**
		 * Polling frequency (in ms). Defaults to Client's pollingInterval config.
		 * @default client.pollingInterval
		 */
		pollingInterval?: number | undefined;
	};
export type WaitToProveReturnType = {
	output: WaitForNextL2OutputReturnType;
	withdrawal: Withdrawal;
};

export type WaitToProveErrorType =
	| GetWithdrawalsErrorType
	| WaitForNextL2OutputErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link WaitToProveParameters}
 * @returns The L2 output and withdrawal message. {@link WaitToProveReturnType}
 */
export async function waitToProve<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: WaitToProveParameters<chain, chainOverride>,
): Promise<WaitToProveReturnType> {
	const { receipt } = parameters;

	const [withdrawal] = getWithdrawals(receipt);

	if (!withdrawal) {
		throw new ReceiptContainsNoWithdrawalsError({
			hash: receipt.transactionHash,
		});
	}

	const output = await waitForNextL2Output(client, {
		...parameters,
		l2BlockNumber: receipt.blockNumber,
	} as WaitForNextL2OutputParameters);
	return {
		output,
		withdrawal,
	};
}
