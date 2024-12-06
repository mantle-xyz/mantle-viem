import type { Account, Client, Transport } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import type { Hex } from "viem";
import type { OneOf } from "viem";
import { readContract, type ReadContractErrorType } from "viem/actions";
import { l2OutputOracleAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { TargetChain } from "../types/chain.js";
import type { GetContractAddressParameter } from "../types/contract.js";

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
	};
export type GetL2OutputReturnType = {
	outputIndex: bigint;
	outputRoot: Hex;
	timestamp: bigint;
	l2BlockNumber: bigint;
};
export type GetL2OutputErrorType = ReadContractErrorType | ErrorType;

/**
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
	const { chain = client.chain, l2BlockNumber, targetChain } = parameters;

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
