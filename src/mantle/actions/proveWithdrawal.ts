import type { Address } from "viem";
import type { Client, FormattedTransactionRequest, Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hash, Hex } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import {
	writeContract,
	type WriteContractErrorType,
	type WriteContractParameters,
} from "viem/actions";
import { portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { Withdrawal } from "../types/withdrawal.js";
import type { EstimateProveWithdrawalGasErrorType } from "./estimateProveWithdrawalGas.js";

export type ProveWithdrawalParameters<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
	UnionOmit<
		FormattedTransactionRequest<_derivedChain>,
		| "accessList"
		| "blobs"
		| "data"
		| "from"
		| "gas"
		| "maxFeePerBlobGas"
		| "gasPrice"
		| "to"
		| "type"
		| "value"
	>
> &
	GetAccountParameter<account, Account | Address> &
	GetChainParameter<chain, chainOverride> &
	GetContractAddressParameter<_derivedChain, "portal"> & {
		/**
		 * Gas limit for transaction execution on the L1.
		 */
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
export type ProveWithdrawalReturnType = Hash;
export type ProveWithdrawalErrorType =
	| EstimateProveWithdrawalGasErrorType
	| WriteContractErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link ProveWithdrawalParameters}
 * @returns The prove transaction hash. {@link ProveWithdrawalReturnType}
 */
export async function proveWithdrawal<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: ProveWithdrawalParameters<chain, account, chainOverride>,
): Promise<ProveWithdrawalReturnType> {
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

	return writeContract(client, {
		account: account!,
		abi: portalAbi,
		address: portalAddress,
		chain,
		functionName: "proveWithdrawalTransaction",
		args: [withdrawal, l2OutputIndex, outputRootProof, withdrawalProof],
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
	} satisfies WriteContractParameters as any);
}
