import type { Address } from "viem";
import type { Client, FormattedTransactionRequest, Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hash } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import {
	writeContract,
	type WriteContractErrorType,
	type WriteContractParameters,
} from "viem/actions";
import { l2StandardBridge } from "../abis.js";
import { contracts } from "../contracts.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { InitiateERC20WithdrawalRequest } from "../types/withdrawal.js";
import { parseInitWithdrawequest } from "../utils/parseInitWithdrawRequest.js";

export type InitiateERC20WithdrawalParameters<
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
	GetChainParameter<chain, chainOverride> & {
		/**
		 * Gas limit for transaction execution on the L2.
		 */
		gas?: bigint | undefined;
		/** Withdrawal request. Supplied to the L2ToL1MessagePasser `initiateERC20Withdrawal` method. */
		request: InitiateERC20WithdrawalRequest;
	};
export type InitiateERC20WithdrawalReturnType = Hash;
export type InitiateERC20WithdrawalErrorType =
	| WriteContractErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link InitiateERC20WithdrawalParameters}
 * @returns The L2 transaction hash. {@link InitiateERC20WithdrawalReturnType}
 */
export async function initiateERC20Withdrawal<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: InitiateERC20WithdrawalParameters<chain, account, chainOverride>,
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
		type: "erc20",
		l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828",
		amount,
		to,
	});

	return writeContract(client, {
		account: account!,
		abi: l2StandardBridge,
		address: contracts.l2StandardBridge.address,
		chain,
		functionName,
		args,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
	} satisfies WriteContractParameters as any);
}
