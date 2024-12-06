import type { Account, Client, Transport } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { TransactionReceipt } from "viem";
import type { OneOf } from "viem";
import type { ErrorType } from "../errors/utils.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import {
	getTimeToNextL2Output,
	type GetTimeToNextL2OutputErrorType,
	type GetTimeToNextL2OutputParameters,
	type GetTimeToNextL2OutputReturnType,
} from "./getTimeToNextL2Output.js";

export type GetTimeToProveParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	OneOf<
		| GetContractAddressParameter<_derivedChain, "l2OutputOracle">
		| GetContractAddressParameter<_derivedChain, "portal">
	> & {
		/**
		 * The buffer to account for discrepancies between non-deterministic time intervals.
		 * @default 1.1
		 */
		intervalBuffer?:
			| GetTimeToNextL2OutputParameters["intervalBuffer"]
			| undefined;
		receipt: TransactionReceipt;
	};

export type GetTimeToProveReturnType = GetTimeToNextL2OutputReturnType;

export type GetTimeToProveErrorType =
	| GetTimeToNextL2OutputErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link GetTimeToNextL2OutputParameters}
 * @returns Time until prove step is ready. {@link GetTimeToNextL2OutputReturnType}
 */
export async function getTimeToProve<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: GetTimeToProveParameters<chain, chainOverride>,
): Promise<GetTimeToProveReturnType> {
	const { receipt } = parameters;

	return getTimeToNextL2Output(client, {
		...parameters,
		l2BlockNumber: receipt.blockNumber,
	} as GetTimeToNextL2OutputParameters);
}
