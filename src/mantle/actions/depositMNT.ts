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
import { l1StandardBridge } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import type { DepositMNTRequest } from "../types/deposit.js";
import { parseDepositRequest } from "../utils/parseDepositRequest.js";

export type DepositMNTParameters<
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
	GetContractAddressParameter<_derivedChain, "l1StandardBridge"> & {
		/** L2 transaction request. */
		request: DepositMNTRequest;
		/**
		 * Gas limit for transaction execution on the L1.
		 */
		gas?: bigint | undefined;
	};
export type DepositMNTReturnType = Hash;
export type DepositMNTErrorType = WriteContractErrorType | ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link DepositMNTParameters}
 * @returns The L1 transaction hash. {@link DepositMNTReturnType}
 */
export async function depositMNT<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: DepositMNTParameters<chain, account, chainOverride>,
) {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		request: { amount, to },
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
		type: "mnt",
		amount,
		to,
	});

	return writeContract(client, {
		account: account!,
		abi: l1StandardBridge,
		address: l1StandardBridgeAddress,
		chain,
		functionName,
		args,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		gas,
	} satisfies WriteContractParameters as any);
}
