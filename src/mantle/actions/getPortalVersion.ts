import type { Client, Transport } from "viem";
import type { Chain, DeriveChain, GetChainParameter } from "viem";
import { readContract, type ReadContractErrorType } from "viem/actions";
import { portal2Abi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import type { GetContractAddressParameter } from "../types/contract.js";
import { withCache } from "../utils/promise/withCache.js";

export type GetPortalVersionParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	_derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
	GetContractAddressParameter<_derivedChain, "portal">;

export type GetPortalVersionReturnType = {
	major: number;
	minor: number;
	patch: number;
};

export type GetPortalVersionErrorType = ReadContractErrorType | ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link GetPortalVersionParameters}
 * @returns The version object.
 */
export async function getPortalVersion<
	chain extends Chain | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain>,
	parameters: GetPortalVersionParameters<chain, chainOverride>,
) {
	const { chain = client.chain, targetChain } = parameters;

	const portalAddress = (() => {
		if (parameters.portalAddress) return parameters.portalAddress;
		if (chain) return targetChain!.contracts.portal[chain.id].address;
		return Object.values(targetChain!.contracts.portal)[0].address;
	})();

	const version = await withCache(
		() =>
			readContract(client, {
				abi: portal2Abi,
				address: portalAddress,
				functionName: "version",
			}),
		{ cacheKey: ["portalVersion", portalAddress].join("."), cacheTime: 300 },
	);

	const [major, minor, patch] = version.split(".").map(Number);

	return { major, minor, patch };
}
