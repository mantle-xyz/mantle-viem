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
import type { InitiateETHWithdrawalRequest } from "../types/withdrawal.js";
import { parseInitWithdrawRequest } from "../utils/parseInitWithdrawRequest.js";
import {
	estimateTotalFee,
	type EstimateTotalFeeErrorType,
} from "./estimateTotalFee.js";

export type EstimateInitiateETHWithdrawalFeeParameters<
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
		/** Gas limit for transaction execution on the L2. */
		gas?: bigint | undefined;
	};

export type EstimateInitiateETHWithdrawalFeeReturnType = bigint;

export type EstimateInitiateETHWithdrawalFeeErrorType =
	| EstimateTotalFeeErrorType
	| ErrorType;

/**
 * Estimates the total fee (L1 data fee + L2 execution fee + operator fee)
 * required to initiate an ETH withdrawal on the L2, as computed by Mantle's
 * `eth_estimateTotalFee` RPC method.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateInitiateETHWithdrawalFeeParameters}
 * @returns The total fee (in wei). {@link EstimateInitiateETHWithdrawalFeeReturnType}
 */
export async function estimateInitiateETHWithdrawalFee<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: EstimateInitiateETHWithdrawalFeeParameters<
		chain,
		account,
		chainOverride
	>,
): Promise<EstimateInitiateETHWithdrawalFeeReturnType> {
	const {
		account,
		chain = client.chain,
		gas,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		request: { amount, to },
	} = parameters;

	const { functionName, args } = parseInitWithdrawRequest({
		type: "eth",
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
