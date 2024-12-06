import type { Address } from "viem";

import type { Chain } from "viem";
import type { Prettify } from "viem";
import type { TargetChain } from "./chain.js";

export type GetContractAddressParameter<
	chain extends Chain | undefined,
	contractName extends string,
> =
	| (chain extends Chain
			? Prettify<
					{
						targetChain: Prettify<TargetChain<chain, contractName>>;
					} & {
						[_ in `${contractName}Address`]?: undefined;
					}
				>
			: never)
	| Prettify<
			{
				targetChain?: undefined;
			} & {
				[_ in `${contractName}Address`]: Address;
			}
	  >;
