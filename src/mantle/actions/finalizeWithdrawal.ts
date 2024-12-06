import type { Address } from "viem";
import type { Client, Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hash } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import {
	writeContract,
	type WriteContractErrorType,
	type WriteContractParameters,
} from "viem/actions";
import type { FormattedTransactionRequest } from "viem/utils";
import { portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { Withdrawal } from "../types/withdrawal.js";
import {
	estimateFinalizeWithdrawalGas,
	type EstimateFinalizeWithdrawalGasErrorType,
	type EstimateFinalizeWithdrawalGasParameters,
} from "./estimateFinalizeWithdrawalGas.js";

export type FinalizeWithdrawalParameters<
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
		/**
		 * Gas limit for transaction execution on the L1.
		 * `null` to skip gas estimation & defer calculation to signer.
		 */
		gas?: bigint | null | undefined;
		withdrawal: Withdrawal;
	};
export type FinalizeWithdrawalReturnType = Hash;
export type FinalizeWithdrawalErrorType =
	| EstimateFinalizeWithdrawalGasErrorType
	| WriteContractErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link FinalizeWithdrawalParameters}
 * @returns The finalize transaction hash. {@link FinalizeWithdrawalReturnType}
 */
export async function finalizeWithdrawal<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: FinalizeWithdrawalParameters<chain, account, chainOverride>,
): Promise<FinalizeWithdrawalReturnType> {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		targetChain,
		withdrawal,
	} = parameters;

	const portalAddress = (() => {
		if (parameters.portalAddress) return parameters.portalAddress;
		if (chain) return targetChain!.contracts.portal[chain.id].address;
		return Object.values(targetChain!.contracts.portal)[0].address;
	})();

	const gas_ =
		typeof gas !== "number" && gas !== null
			? await estimateFinalizeWithdrawalGas(
					client,
					parameters as EstimateFinalizeWithdrawalGasParameters,
				)
			: undefined;

	return writeContract(client, {
		account: account!,
		abi: portalAbi,
		address: portalAddress,
		chain,
		functionName: "finalizeWithdrawalTransaction",
		args: [withdrawal],
		gas: gas_,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
	} satisfies WriteContractParameters as any);
}
