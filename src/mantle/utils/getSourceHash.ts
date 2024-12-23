// Adapted from https://github.com/ethereum-optimism/optimism/blob/develop/packages/core-utils/src/optimism/deposit-transaction.ts#L117

import type { ErrorType } from "../../errors/utils.js";
import type { Hex } from "../../types/misc.js";
import { concat, type ConcatErrorType } from "../../utils/data/concat.js";
import { pad, type PadErrorType } from "../../utils/data/pad.js";
import { toHex, type ToHexErrorType } from "../../utils/encoding/toHex.js";
import {
	keccak256,
	type Keccak256ErrorType,
} from "../../utils/hash/keccak256.js";

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
