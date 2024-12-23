import type { Address } from "viem";
import type { Hex } from "viem";

export type InitialteWithdrawalRequest = {
	/** L2 Transaction recipient. */
	// to: Address;
	amount: bigint;
	to?: Address;
} & (
	| {
			type: "mnt" | "eth";
			l2Token?: undefined;
	  }
	| {
			type: "erc20";
			/** Other ERC20 L2 Token Address. */
			l2Token: Address;
	  }
);

export type InitiateERC20WithdrawalRequest = {
	amount: bigint;
	/** Other ERC20 L2 Token Address. */
	l2Token: Address;
	to?: Address;
};
export type InitiateMNTWithdrawalRequest = {
	amount: bigint;
	to?: Address;
};
export type InitiateETHWithdrawalRequest = {
	amount: bigint;
	to?: Address;
};

export type Withdrawal = {
	nonce: bigint;
	sender: Hex;
	target: Hex;
	mntValue: bigint;
	ethValue: bigint;
	gasLimit: bigint;
	data: Hex;
	withdrawalHash: Hex;
};
