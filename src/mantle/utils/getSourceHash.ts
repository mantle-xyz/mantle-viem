import {
	concat,
	type ConcatErrorType,
	keccak256,
	type Keccak256ErrorType,
	pad,
	type PadErrorType,
	toHex,
	type ToHexErrorType,
} from "viem";
import type { Hex } from "viem";
import type { ErrorType } from "../errors/utils.js";

export type GetSourceHashParameters = {
	/** The L1 block hash. */
	l1BlockHash: Hex;
} & (
	| {
			/** Domain of source hash. */
			domain: "userDeposit";
			/** The index of the log on the L1. */
			l1LogIndex: number;
			/** The sequence number. */
			sequenceNumber?: undefined;
	  }
	| {
			/** Domain of source hash. */
			domain: "l1InfoDeposit";
			/** The index of the log on the L1. */
			l1LogIndex?: undefined;
			/** The sequence number. */
			sequenceNumber: number;
	  }
);

export type GetSourceHashReturnType = Hex;

export type GetSourceHashErrorType =
	| ConcatErrorType
	| Keccak256ErrorType
	| PadErrorType
	| ToHexErrorType
	| ErrorType;

const sourceHashDomainMap = {
	userDeposit: 0,
	l1InfoDeposit: 1,
} as const;

export function getSourceHash({
	domain,
	l1LogIndex,
	l1BlockHash,
	sequenceNumber,
}: GetSourceHashParameters) {
	const marker = toHex(l1LogIndex! ?? sequenceNumber!);
	const input = concat([l1BlockHash, pad(marker, { size: 32 })]);
	const depositIdHash = keccak256(input);
	const domainHex = toHex(sourceHashDomainMap[domain]);
	const domainInput = concat([pad(domainHex, { size: 32 }), depositIdHash]);
	return keccak256(domainInput);
}
