import type { Address } from "viem";

export type DepositRequest = {
	/** L2 Transaction recipient. */
	// to: Address;
	amount: bigint;
	to?: Address;
} & (
	| {
			type: "mnt" | "eth";
			/** Other ERC20 L1 Token Address. */
			l1Token?: undefined;
			/** Other ERC20 L2 Token Address. */
			l2Token?: undefined;
	  }
	| {
			type: "erc20";
			/** Other ERC20 L1 Token Address. */
			l1Token: Address;
			/** Other ERC20 L2 Token Address. */
			l2Token: Address;
	  }
);

export type DepositERC20Request = {
	amount: bigint;
	/** Other ERC20 L1 Token Address. */
	l1Token: Address;
	/** Other ERC20 L2 Token Address. */
	l2Token: Address;
	to?: Address;
};
export type DepositMNTRequest = {
	amount: bigint;
	to?: Address;
};
export type DepositETHRequest = {
	amount: bigint;
	to?: Address;
};
