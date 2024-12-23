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
import { l1StandardBridge } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { DepositERC20Request } from "../types/deposit.js";
import { parseDepositRequest } from "../utils/parseDepositRequest.js";

export type EstimateDepositERC20GasParameters<
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
	GetChainParameter<chain, chainOverride> &
	GetContractAddressParameter<derivedChain, "l1StandardBridge"> & {
		/** L2 transaction request. */
		request: DepositERC20Request;
		/** Gas limit for transaction execution on the L1. */
		gas?: bigint | undefined;
	};

export type EstimateDepositERC20GasReturnType = bigint;

export type EstimateDepositERC20GasErrorType =
	| EstimateContractGasErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link EstimateDepositERC20GasParameters}
 * @returns The L1 transaction hash. {@link EstimateDepositERC20GasReturnType}
 */
export async function estimateDepositERC20Gas<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: EstimateDepositERC20GasParameters<chain, account, chainOverride>,
) {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		request: { l1Token, l2Token, amount, to },
		targetChain,
	} = parameters;

	const l1StandardBridgeAddress = (() => {
		if (parameters.l1StandardBridgeAddress) {
			return parameters.l1StandardBridgeAddress;
		}
		if (chain) return targetChain!.contracts.l1StandardBridge[chain.id].address;
		return Object.values(targetChain!.contracts.l1StandardBridge)[0].address;
	})();

	const { functionName, args } = parseDepositRequest({
		type: "erc20",
		l1Token,
		l2Token,
		amount,
		to,
	});

	const params = {
		account,
		abi: l1StandardBridge,
		address: l1StandardBridgeAddress,
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
		typeof l1StandardBridge,
		typeof functionName
	>;
	return estimateContractGas(client, params as any);
}
