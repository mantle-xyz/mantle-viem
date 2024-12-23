import type { Address } from "viem";

import type { Client, Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import {
	estimateContractGas,
	type EstimateContractGasErrorType,
	type EstimateContractGasParameters,
} from "viem/actions";
import type { FormattedTransactionRequest } from "viem/utils";
import { l2StandardBridge } from "../abis.js";
import { contracts } from "../contracts.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { InitiateETHWithdrawalRequest } from "../types/withdrawal.js";
import { parseInitWithdrawequest } from "../utils/parseInitWithdrawRequest.js";

export type EstimateInitiateETHWithdrawalGasParameters<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	///
	derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
	UnionOmit<
		FormattedTransactionRequest<derivedChain>,
		| "accessList"
		| "data"
		| "from"
		| "gas"
		| "gasPrice"
		| "to"
		| "type"
		| "value"
	>
> &
	GetAccountParameter<account, Account | Address> &
	GetChainParameter<chain, chainOverride> & {
		/** L2 transaction request. */
		request: InitiateETHWithdrawalRequest;
		/** Gas limit for transaction execution on the L1. */
		gas?: bigint | undefined;
	};

export type EstimateInitiateETHWithdrawalGasReturnType = bigint;

export type EstimateInitiateETHWithdrawalGasErrorType =
	| EstimateContractGasErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link EstimateInitiateETHWithdrawalGasParameters}
 * @returns The L1 transaction hash. {@link EstimateInitiateETHWithdrawalGasReturnType}
 */
export async function estimateInitiateETHWithdrawalGas<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: EstimateInitiateETHWithdrawalGasParameters<
		chain,
		account,
		chainOverride
	>,
) {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		request: { amount, to },
	} = parameters;

	const { functionName, args } = parseInitWithdrawequest({
		type: "eth",
		amount,
		to,
	});

	const params = {
		account,
		abi: l2StandardBridge,
		address: contracts.l2StandardBridge.address,
		functionName,
		args,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		// TODO: Not sure `chain` is necessary since it's not used downstream
		// in `estimateContractGas` or `estimateGas`
		// @ts-ignore
		chain,
	} satisfies EstimateContractGasParameters<
		typeof l2StandardBridge,
		typeof functionName
	>;
	return estimateContractGas(client, params as any);
}
