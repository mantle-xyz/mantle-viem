import type { Address } from "viem";
import type { Client } from "viem";
import type { Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hex } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import {
	estimateContractGas,
	type EstimateContractGasErrorType,
	type EstimateContractGasParameters,
} from "viem/actions";
import type { FormattedTransactionRequest } from "viem/utils";
import { portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { Withdrawal } from "../types/withdrawal.js";

export type EstimateProveWithdrawalGasParameters<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
	UnionOmit<
		FormattedTransactionRequest<_derivedChain>,
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
	GetContractAddressParameter<_derivedChain, "portal"> & {
		/** Gas limit for transaction execution on the L2. */
		gas?: bigint | undefined;
		l2OutputIndex: bigint;
		outputRootProof: {
			version: Hex;
			stateRoot: Hex;
			messagePasserStorageRoot: Hex;
			latestBlockhash: Hex;
		};
		withdrawalProof: readonly Hex[];
		withdrawal: Withdrawal;
	};
export type EstimateProveWithdrawalGasReturnType = bigint;
export type EstimateProveWithdrawalGasErrorType =
	| EstimateContractGasErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link EstimateProveWithdrawalGasParameters}
 * @returns Estimated gas. {@link EstimateProveWithdrawalGasReturnType}
 */
export async function estimateProveWithdrawalGas<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: EstimateProveWithdrawalGasParameters<
		chain,
		account,
		chainOverride
	>,
) {
	const {
		account,
		chain = client.chain,
		gas,
		l2OutputIndex,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		outputRootProof,
		targetChain,
		withdrawalProof,
		withdrawal,
	} = parameters;

	const portalAddress = (() => {
		if (parameters.portalAddress) return parameters.portalAddress;
		if (chain) return targetChain!.contracts.portal[chain.id].address;
		return Object.values(targetChain!.contracts.portal)[0].address;
	})();

	const params = {
		account,
		abi: portalAbi,
		address: portalAddress,
		functionName: "proveWithdrawalTransaction",
		args: [withdrawal, l2OutputIndex, outputRootProof, withdrawalProof],
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		// TODO: Not sure `chain` is necessary since it's not used downstream
		// in `estimateContractGas` or `estimateGas`
		// @ts-ignore
		chain,
	} satisfies EstimateContractGasParameters<
		typeof portalAbi,
		"proveWithdrawalTransaction"
	>;
	return estimateContractGas(client, params as any);
}
