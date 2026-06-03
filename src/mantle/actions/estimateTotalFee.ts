import type {
	Account,
	Address,
	Chain,
	Client,
	GetChainParameter,
	Hex,
	RpcTransactionRequest,
	Transport,
	UnionEvaluate,
	UnionOmit,
} from "viem";
import { hexToBigInt } from "viem";
import {
	type FormattedTransactionRequest,
	formatTransactionRequest,
	parseAccount,
} from "viem/utils";
import type { ErrorType } from "../errors/utils.js";
import type { GetAccountParameter } from "../types/account.js";

export type EstimateTotalFeeParameters<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
> = UnionEvaluate<UnionOmit<FormattedTransactionRequest, "from">> &
	// `required: false` — the node accepts a request without `from`, so account
	// is optional (matches the runtime behavior of `eth_estimateTotalFee`).
	GetAccountParameter<account, Account | Address, false> &
	GetChainParameter<chain, chainOverride>;

export type EstimateTotalFeeReturnType = bigint;

export type EstimateTotalFeeErrorType = ErrorType;

/**
 * Estimates the total fee (L1 data fee + L2 execution fee + operator fee)
 * required to execute an L2 transaction, as computed by Mantle's
 * `eth_estimateTotalFee` RPC method.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateTotalFeeParameters}
 * @returns The total fee (in wei). {@link EstimateTotalFeeReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { mantle } from '@mantleio/viem/chains'
 * import { estimateTotalFee } from '@mantleio/viem'
 *
 * const client = createPublicClient({
 *   chain: mantle,
 *   transport: http(),
 * })
 * const totalFee = await estimateTotalFee(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: parseEther('1'),
 * })
 */
export async function estimateTotalFee<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	args: EstimateTotalFeeParameters<chain, account, chainOverride>,
): Promise<EstimateTotalFeeReturnType> {
	const { account: account_ = client.account, ...rest } = args;

	const account = account_ ? parseAccount(account_) : undefined;

	// `formatTransactionRequest` only copies known transaction fields (hex-encoding
	// the numeric ones) and drops everything else — so client-only overrides such as
	// `chain` never leak into the RPC call object.
	const request = formatTransactionRequest({
		...rest,
		from: account?.address,
	});

	const result = await client.request<{
		Method: "eth_estimateTotalFee";
		Parameters: [RpcTransactionRequest];
		ReturnType: Hex;
	}>({
		method: "eth_estimateTotalFee",
		params: [request],
	});

	return hexToBigInt(result);
}
