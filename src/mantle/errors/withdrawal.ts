import { BaseError } from "viem";
import type { Hex } from "viem";

export type GameNotFoundErrorType = GameNotFoundError & {
	name: "GameNotFoundError";
};
export class GameNotFoundError extends BaseError {
	constructor() {
		super("Dispute game not found.", { name: "GameNotFoundError" });
	}
}

export type ReceiptContainsNoWithdrawalsErrorType =
	ReceiptContainsNoWithdrawalsError & {
		name: "ReceiptContainsNoWithdrawalsError";
	};
export class ReceiptContainsNoWithdrawalsError extends BaseError {
	constructor({ hash }: { hash: Hex }) {
		super(
			`The provided transaction receipt with hash "${hash}" contains no withdrawals.`,
			{ name: "ReceiptContainsNoWithdrawalsError" },
		);
	}
}

export type LatestL2OutputNotReadyErrorType = LatestL2OutputNotReadyError & {
	name: "LatestL2OutputNotReadyError";
};
export class LatestL2OutputNotReadyError extends BaseError {
	constructor({
		l2BlockNumber,
		latestL2BlockNumber,
	}: {
		l2BlockNumber: bigint;
		latestL2BlockNumber: bigint;
	}) {
		super(
			`The latest L2 output (L2 block ${latestL2BlockNumber}) does not yet cover the withdrawal L2 block (${l2BlockNumber}). The withdrawal is not ready to prove against the latest output.`,
			{ name: "LatestL2OutputNotReadyError" },
		);
	}
}

export type L1CrossDomainMessengerNotFoundErrorType =
	L1CrossDomainMessengerNotFoundError & {
		name: "L1CrossDomainMessengerNotFoundError";
	};
export class L1CrossDomainMessengerNotFoundError extends BaseError {
	constructor() {
		super(
			"Could not resolve the L1CrossDomainMessenger address from the chain. Pass `l1CrossDomainMessengerAddress`.",
			{ name: "L1CrossDomainMessengerNotFoundError" },
		);
	}
}

export type MultipleLegacyWithdrawalsErrorType =
	MultipleLegacyWithdrawalsError & {
		name: "MultipleLegacyWithdrawalsError";
	};
export class MultipleLegacyWithdrawalsError extends BaseError {
	constructor({ hash, count }: { hash: Hex; count: number }) {
		super(
			`The transaction "${hash}" contains ${count} legacy withdrawals (SentMessage logs). buildMigratedWithdrawal only reconstructs a single withdrawal; pass a transaction with exactly one.`,
			{ name: "MultipleLegacyWithdrawalsError" },
		);
	}
}
