import type { Client, Transport } from "viem";
import type { Account } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hash } from "viem";
import { multicall, type MulticallErrorType } from "viem/actions";
import { l2OutputOracleAbi, portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetContractAddressParameter } from "../types/contract.js";

export type GetTimeToFinalizeParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	GetContractAddressParameter<_derivedChain, "l2OutputOracle" | "portal"> & {
		withdrawalHash: Hash;
	};
export type GetTimeToFinalizeReturnType = {
	/** The finalization period (in seconds). */
	period: number;
	/** Seconds until the withdrawal can be finalized. */
	seconds: number;
	/** Timestamp of when the withdrawal can be finalized. */
	timestamp: number;
};
export type GetTimeToFinalizeErrorType = MulticallErrorType | ErrorType;

const buffer = 10;

/**
 * @param client - Client to use
 * @param parameters - {@link GetTimeToFinalizeParameters}
 * @returns Time until finalize. {@link GetTimeToFinalizeReturnType}
 */
export async function getTimeToFinalize<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: GetTimeToFinalizeParameters<chain, chainOverride>,
): Promise<GetTimeToFinalizeReturnType> {
	const { chain = client.chain, withdrawalHash, targetChain } = parameters;

	const portalAddress = (() => {
		if (parameters.portalAddress) return parameters.portalAddress;
		if (chain) return targetChain!.contracts.portal[chain.id].address;
		return Object.values(targetChain!.contracts.portal)[0].address;
	})();

	const l2OutputOracleAddress = (() => {
		if (parameters.l2OutputOracleAddress) {
			return parameters.l2OutputOracleAddress;
		}
		if (chain) return targetChain!.contracts.l2OutputOracle[chain.id].address;
		return Object.values(targetChain!.contracts.l2OutputOracle)[0].address;
	})();
	const [[_outputRoot, proveTimestamp, _l2OutputIndex], period] =
		await multicall(client, {
			allowFailure: false,
			contracts: [
				{
					abi: portalAbi,
					address: portalAddress,
					functionName: "provenWithdrawals",
					args: [withdrawalHash],
				},
				{
					abi: l2OutputOracleAbi,
					address: l2OutputOracleAddress,
					functionName: "FINALIZATION_PERIOD_SECONDS",
				},
			],
		});

	const secondsSinceProven = Date.now() / 1000 - Number(proveTimestamp);
	const secondsToFinalize = Number(period) - secondsSinceProven;

	const seconds = Math.floor(
		secondsToFinalize < 0 ? 0 : secondsToFinalize + buffer,
	);
	const timestamp = Date.now() + seconds * 1000;

	return { period: Number(period), seconds, timestamp };
}
