import type { Address } from "viem";
import type { Client } from "viem";
import type { Transport } from "viem";
import type { Account } from "viem";
import type { Chain } from "viem";
import type { UnionEvaluate, UnionOmit } from "viem";
import { hexToBigInt } from "viem";
import type { FormattedTransactionRequest } from "viem/utils";
import type { ErrorType } from "../errors/utils.js";

export type EstimateTotalFeeParameters<
	_chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
> = UnionEvaluate<UnionOmit<FormattedTransactionRequest, "from">> & {
	account?: account | Address | undefined;
	chain?: chainOverride | Chain | null | undefined;
	[key: string]: any;
};

export type EstimateTotalFeeReturnType = bigint;

export type EstimateTotalFeeErrorType = ErrorType;

/**
 * Estimates the L1 data fee + L2 fee + operator fee to execute an L2 transaction.
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateTotalFeeParameters}
 * @returns The fee (in wei). {@link EstimateTotalFeeReturnType}
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
	const {
		account = client.account,
		accessList,
		data,
		gas,
		gasPrice,
		maxFeePerGas,
		maxPriorityFeePerGas,
		nonce,
		to,
		value,
		...rest
	} = args;

	const accountAddress = account
		? typeof account === "string"
			? account
			: account.address
		: undefined;

	const callParams: Record<string, any> = {
		from: accountAddress,
		to,
		data,
		value: value !== undefined ? `0x${value.toString(16)}` : undefined,
		gas: gas !== undefined ? `0x${gas.toString(16)}` : undefined,
		gasPrice: gasPrice !== undefined ? `0x${gasPrice.toString(16)}` : undefined,
		maxFeePerGas:
			maxFeePerGas !== undefined ? `0x${maxFeePerGas.toString(16)}` : undefined,
		maxPriorityFeePerGas:
			maxPriorityFeePerGas !== undefined
				? `0x${maxPriorityFeePerGas.toString(16)}`
				: undefined,
		nonce: nonce !== undefined ? `0x${nonce.toString(16)}` : undefined,
		accessList,
		...rest,
	};

	for (const key in callParams) {
		if (callParams[key] === undefined) {
			delete callParams[key];
		}
	}

	const result = await client.request({
		method: "eth_estimateTotalFee" as any,
		params: [callParams] as any,
	});

	return hexToBigInt(result as `0x${string}`);
}
