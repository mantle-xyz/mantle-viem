import type { Account, Client, Transport } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hex } from "viem";
import type { OneOf } from "viem";
import { readContract, type ReadContractErrorType } from "viem/actions";
import { l2OutputOracleAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import {
	LatestL2OutputNotReadyError,
	type LatestL2OutputNotReadyErrorType,
} from "../errors/withdrawal.js";
import type { TargetChain } from "../types/chain.js";
import type { GetContractAddressParameter } from "../types/contract.js";

/**
 * Strategy used to pick the L2 output that a withdrawal is proven against.
 *
 * - `latest` (default) - the most recently committed output (via
 *   `latestOutputIndex`) that still covers the L2 block. Proving against the
 *   latest output reads the storage proof at a recent L2 block, so it does not
 *   introduce an archive RPC dependency. It does not change the finalize
 *   waiting time (the finalization window is measured from the prove
 *   timestamp). It relies only on the latest L2 output commitment already
 *   submitted to the L1.
 * - `earliest` - the first output covering the L2 block (via
 *   `getL2OutputIndexAfter`). This is the historical behaviour; it may require
 *   an archive node to read the storage proof for old withdrawals.
 */
export type GetL2OutputStrategy = "latest" | "earliest";

export type GetL2OutputParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	OneOf<
		| GetContractAddressParameter<_derivedChain, "l2OutputOracle">
		| GetContractAddressParameter<_derivedChain, "portal">
	> & {
		l2BlockNumber: bigint;
		/**
		 * Which output to return for the given L2 block. Defaults to `latest`.
		 * @default "latest"
		 */
		strategy?: GetL2OutputStrategy | undefined;
	};
export type GetL2OutputReturnType = {
	outputIndex: bigint;
	outputRoot: Hex;
	timestamp: bigint;
	l2BlockNumber: bigint;
};
export type GetL2OutputErrorType =
	| LatestL2OutputNotReadyErrorType
	| ReadContractErrorType
	| ErrorType;

/**
 * Retrieves an L2 output committed to the `L2OutputOracle` on the L1 that can be
 * used to prove a withdrawal at the given L2 block.
 *
 * By default (`strategy: "latest"`) it returns the most recent committed output
 * that covers `l2BlockNumber`, which avoids an archive RPC dependency for old
 * withdrawals without changing the finalize waiting time. Pass
 * `strategy: "earliest"` to restore the historical "first covering output"
 * behaviour.
 *
 * @param client - Client to use
 * @param parameters - {@link GetL2OutputParameters}
 * @returns The L2 output. {@link GetL2OutputReturnType}
 */
export async function getL2Output<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: GetL2OutputParameters<chain, chainOverride>,
): Promise<GetL2OutputReturnType> {
	const {
		chain = client.chain,
		l2BlockNumber,
		strategy = "latest",
		targetChain,
	} = parameters;

	const l2OutputOracleAddress = (() => {
		if (parameters.l2OutputOracleAddress) {
			return parameters.l2OutputOracleAddress;
		}
		if (chain) {
			return (targetChain as unknown as TargetChain)!.contracts.l2OutputOracle[
				chain.id
			].address;
		}
		return (
			Object.values(
				(targetChain as unknown as TargetChain)!.contracts.l2OutputOracle,
			) as any
		)[0].address;
	})();

	if (strategy === "earliest") {
		const outputIndex = await readContract(client, {
			address: l2OutputOracleAddress,
			abi: l2OutputOracleAbi,
			functionName: "getL2OutputIndexAfter",
			args: [l2BlockNumber],
		});
		const output = await readContract(client, {
			address: l2OutputOracleAddress,
			abi: l2OutputOracleAbi,
			functionName: "getL2Output",
			args: [outputIndex],
		});
		return { outputIndex, ...output };
	}

	const outputIndex = await readContract(client, {
		address: l2OutputOracleAddress,
		abi: l2OutputOracleAbi,
		functionName: "latestOutputIndex",
	});
	const output = await readContract(client, {
		address: l2OutputOracleAddress,
		abi: l2OutputOracleAbi,
		functionName: "getL2Output",
		args: [outputIndex],
	});

	// The latest output must cover the withdrawal's L2 block; otherwise the
	// withdrawal is not yet ready to prove. An output whose checkpoint block
	// equals the withdrawal block covers it (matching the on-chain
	// `getL2OutputIndexAfter` predicate `outputBlock >= l2BlockNumber`), so only
	// a strictly-lower latest output is "not ready".
	if (output.l2BlockNumber < l2BlockNumber) {
		throw new LatestL2OutputNotReadyError({
			l2BlockNumber,
			latestL2BlockNumber: output.l2BlockNumber,
		});
	}

	return { outputIndex, ...output };
}
