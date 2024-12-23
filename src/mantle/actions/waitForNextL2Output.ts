import type { Client, Transport } from "viem";
import { ContractFunctionRevertedError } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { ErrorType } from "../errors/utils.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import { poll } from "../utils/poll.js";
import {
	getL2Output,
	type GetL2OutputErrorType,
	type GetL2OutputParameters,
	type GetL2OutputReturnType,
} from "./getL2Output.js";
import {
	getTimeToNextL2Output,
	type GetTimeToNextL2OutputErrorType,
	type GetTimeToNextL2OutputParameters,
} from "./getTimeToNextL2Output.js";

export type WaitForNextL2OutputParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	GetContractAddressParameter<_derivedChain, "l2OutputOracle"> & {
		/**
		 * The buffer to account for discrepancies between non-deterministic time intervals.
		 * @default 1.1
		 */
		intervalBuffer?:
			| GetTimeToNextL2OutputParameters["intervalBuffer"]
			| undefined;
		l2BlockNumber: bigint;
		/**
		 * Polling frequency (in ms). Defaults to Client's pollingInterval config.
		 * @default client.pollingInterval
		 */
		pollingInterval?: number | undefined;
	};
export type WaitForNextL2OutputReturnType = GetL2OutputReturnType;
export type WaitForNextL2OutputErrorType =
	| GetL2OutputErrorType
	| GetTimeToNextL2OutputErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link WaitForNextL2OutputParameters}
 * @returns The L2 transaction hash. {@link WaitForNextL2OutputReturnType}
 */
export async function waitForNextL2Output<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: WaitForNextL2OutputParameters<chain, chainOverride>,
): Promise<WaitForNextL2OutputReturnType> {
	const { pollingInterval = client.pollingInterval } = parameters;

	const { seconds } = await getTimeToNextL2Output(client, parameters);

	return new Promise((resolve, reject) => {
		poll(
			async ({ unpoll }) => {
				try {
					const output = await getL2Output(
						client,
						parameters as GetL2OutputParameters,
					);
					unpoll();
					resolve(output);
				} catch (e) {
					const error = e as GetL2OutputErrorType;
					if (!(error.cause instanceof ContractFunctionRevertedError)) {
						unpoll();
						reject(e);
					}
				}
			},
			{
				interval: pollingInterval,
				initialWaitTime: async () => seconds * 1000,
			},
		);
	});
}
