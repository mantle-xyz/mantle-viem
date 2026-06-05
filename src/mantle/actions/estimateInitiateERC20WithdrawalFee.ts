import type {
	Account,
	Address,
	Chain,
	Client,
	DeriveChain,
	EncodeFunctionDataParameters,
	GetChainParameter,
	Transport,
	UnionEvaluate,
	UnionOmit,
} from "viem";
import { encodeFunctionData } from "viem";
import type { FormattedTransactionRequest } from "viem/utils";
import { l2StandardBridge } from "../abis.js";
import { contracts } from "../contracts.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";
import type { InitiateERC20WithdrawalRequest } from "../types/withdrawal.js";
import { parseInitWithdrawRequest } from "../utils/parseInitWithdrawRequest.js";
import {
	estimateTotalFee,
	type EstimateTotalFeeErrorType,
} from "./estimateTotalFee.js";

export type EstimateInitiateERC20WithdrawalFeeParameters<
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
		request: InitiateERC20WithdrawalRequest;
		/** Gas limit for transaction execution on the L2. */
		gas?: bigint | undefined;
	};

export type EstimateInitiateERC20WithdrawalFeeReturnType = bigint;

export type EstimateInitiateERC20WithdrawalFeeErrorType =
	| EstimateTotalFeeErrorType
	| ErrorType;

/**
 * Estimates the total fee (L1 data fee + L2 execution fee + operator fee)
 * required to initiate an ERC20 withdrawal on the L2, as computed by Mantle's
 * `eth_estimateTotalFee` RPC method.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateInitiateERC20WithdrawalFeeParameters}
 * @returns The total fee (in wei). {@link EstimateInitiateERC20WithdrawalFeeReturnType}
 */
export async function estimateInitiateERC20WithdrawalFee<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: EstimateInitiateERC20WithdrawalFeeParameters<
		chain,
		account,
		chainOverride
	>,
): Promise<EstimateInitiateERC20WithdrawalFeeReturnType> {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		request: { amount, l2Token, to },
	} = parameters;

	const { functionName, args } = parseInitWithdrawRequest({
		type: "erc20",
		l2Token,
		amount,
		to,
	});

	const data = encodeFunctionData({
		abi: l2StandardBridge,
		functionName,
		args,
	} as EncodeFunctionDataParameters);

	return estimateTotalFee(client, {
		account,
		chain,
		to: contracts.l2StandardBridge.address,
		data,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
	});
}
