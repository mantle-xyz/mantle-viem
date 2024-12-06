import type {
	Account,
	Chain,
	Client,
	DeriveChain,
	GetChainParameter,
	Transport,
} from "viem";
import { ContractFunctionRevertedError } from "viem";
import { readContract, type ReadContractErrorType } from "viem/actions";
import type { ErrorType } from "../errors/utils.js";

import type { TransactionReceipt } from "viem";
import type { OneOf } from "viem";
import { portal2Abi, portalAbi } from "../abis.js";
import {
	ReceiptContainsNoWithdrawalsError,
	type ReceiptContainsNoWithdrawalsErrorType,
} from "../errors/withdrawal.js";
import type { TargetChain } from "../types/chain.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import {
	getWithdrawals,
	type GetWithdrawalsErrorType,
} from "../utils/getWithdrawals.js";
import {
	getL2Output,
	type GetL2OutputErrorType,
	type GetL2OutputParameters,
} from "./getL2Output.js";
import {
	getPortalVersion,
	type GetPortalVersionParameters,
} from "./getPortalVersion.js";
import {
	getTimeToFinalize,
	type GetTimeToFinalizeErrorType,
	type GetTimeToFinalizeParameters,
} from "./getTimeToFinalize.js";

export type GetWithdrawalStatusParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	OneOf<
		GetContractAddressParameter<_derivedChain, "l2OutputOracle" | "portal">
	> & {
		receipt: TransactionReceipt;
	};
export type GetWithdrawalStatusReturnType =
	| "waiting-to-prove"
	| "ready-to-prove"
	| "waiting-to-finalize"
	| "ready-to-finalize"
	| "finalized";

export type GetWithdrawalStatusErrorType =
	| GetL2OutputErrorType
	| GetTimeToFinalizeErrorType
	| GetWithdrawalsErrorType
	| ReadContractErrorType
	| ReceiptContainsNoWithdrawalsErrorType
	| ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link GetWithdrawalStatusParameters}
 * @returns Status of the withdrawal. {@link GetWithdrawalStatusReturnType}
 */
export async function getWithdrawalStatus<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: GetWithdrawalStatusParameters<chain, chainOverride>,
): Promise<GetWithdrawalStatusReturnType> {
	const {
		chain = client.chain,
		receipt,
		targetChain: targetChain_,
	} = parameters;

	const targetChain = targetChain_ as unknown as TargetChain;

	const portalAddress = (() => {
		if (parameters.portalAddress) return parameters.portalAddress;
		if (chain) return targetChain.contracts.portal[chain.id].address;
		return Object.values(targetChain.contracts.portal)[0].address;
	})();

	const [withdrawal] = getWithdrawals(receipt);

	if (!withdrawal) {
		throw new ReceiptContainsNoWithdrawalsError({
			hash: receipt.transactionHash,
		});
	}

	const portalVersion = await getPortalVersion(
		client,
		parameters as GetPortalVersionParameters,
	);

	// Legacy (Portal < v3)
	if (portalVersion.major < 3) {
		const [outputResult, proveResult, finalizedResult, timeToFinalizeResult] =
			await Promise.allSettled([
				getL2Output(client, {
					...parameters,
					l2BlockNumber: receipt.blockNumber,
				} as GetL2OutputParameters),
				readContract(client, {
					abi: portalAbi,
					address: portalAddress,
					functionName: "provenWithdrawals",
					args: [withdrawal.withdrawalHash],
				}),
				readContract(client, {
					abi: portalAbi,
					address: portalAddress,
					functionName: "finalizedWithdrawals",
					args: [withdrawal.withdrawalHash],
				}),
				getTimeToFinalize(client, {
					...parameters,
					withdrawalHash: withdrawal.withdrawalHash,
				} as GetTimeToFinalizeParameters),
			]);

		// If the L2 Output is not processed yet (ie. the actions throws), this means
		// that the withdrawal is not ready to prove.
		if (outputResult.status === "rejected") {
			const error = outputResult.reason as GetL2OutputErrorType;
			if (
				error.cause instanceof ContractFunctionRevertedError &&
				error.cause.data?.args?.[0] ===
					"L2OutputOracle: cannot get output for a block that has not been proposed"
			) {
				return "waiting-to-prove";
			}
			throw error;
		}
		if (proveResult.status === "rejected") throw proveResult.reason;
		if (finalizedResult.status === "rejected") throw finalizedResult.reason;
		if (timeToFinalizeResult.status === "rejected") {
			throw timeToFinalizeResult.reason;
		}

		const [_, proveTimestamp] = proveResult.value;
		if (!proveTimestamp) return "ready-to-prove";

		const finalized = finalizedResult.value;
		if (finalized) return "finalized";

		const { seconds } = timeToFinalizeResult.value;
		return seconds > 0 ? "waiting-to-finalize" : "ready-to-finalize";
	}

	const numProofSubmitters = await readContract(client, {
		abi: portal2Abi,
		address: portalAddress,
		functionName: "numProofSubmitters",
		args: [withdrawal.withdrawalHash],
	}).catch(() => 1n);

	const proofSubmitter = await readContract(client, {
		abi: portal2Abi,
		address: portalAddress,
		functionName: "proofSubmitters",
		args: [withdrawal.withdrawalHash, numProofSubmitters - 1n],
	}).catch(() => withdrawal.sender);

	const [checkWithdrawalResult, finalizedResult] = await Promise.allSettled([
		readContract(client, {
			abi: portal2Abi,
			address: portalAddress,
			functionName: "checkWithdrawal",
			args: [withdrawal.withdrawalHash, proofSubmitter],
		}),
		readContract(client, {
			abi: portal2Abi,
			address: portalAddress,
			functionName: "finalizedWithdrawals",
			args: [withdrawal.withdrawalHash],
		}),
	]);

	if (finalizedResult.status === "fulfilled" && finalizedResult.value) {
		return "finalized";
	}

	if (checkWithdrawalResult.status === "rejected") {
		const error = checkWithdrawalResult.reason as ReadContractErrorType;
		if (error.cause instanceof ContractFunctionRevertedError) {
			const errorMessage = error.cause.data?.args?.[0];
			if (
				errorMessage === "OptimismPortal: invalid game type" ||
				errorMessage === "OptimismPortal: withdrawal has not been proven yet" ||
				errorMessage ===
					"OptimismPortal: withdrawal has not been proven by proof submitter address yet"
			) {
				return "ready-to-prove";
			}
			if (
				errorMessage ===
					"OptimismPortal: proven withdrawal has not matured yet" ||
				errorMessage ===
					"OptimismPortal: output proposal has not been finalized yet" ||
				errorMessage === "OptimismPortal: output proposal in air-gap"
			) {
				return "waiting-to-finalize";
			}

			if (error.cause.data?.errorName === "InvalidGameType") {
				return "ready-to-prove";
			}
		}
		throw checkWithdrawalResult.reason;
	}
	if (finalizedResult.status === "rejected") throw finalizedResult.reason;

	return "ready-to-finalize";
}
