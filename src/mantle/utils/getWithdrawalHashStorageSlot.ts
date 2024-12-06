import {
	encodeAbiParameters,
	type EncodeAbiParametersErrorType,
	keccak256,
	type Keccak256ErrorType,
} from "viem";
import type { Hash } from "viem";
import type { ErrorType } from "../errors/utils.js";

export type GetWithdrawalHashStorageSlotParameters = {
	withdrawalHash: Hash;
};
export type GetWithdrawalHashStorageSlotReturnType = Hash;
export type GetWithdrawalHashStorageSlotErrorType =
	| EncodeAbiParametersErrorType
	| Keccak256ErrorType
	| ErrorType;

export function getWithdrawalHashStorageSlot({
	withdrawalHash,
}: GetWithdrawalHashStorageSlotParameters) {
	const data = encodeAbiParameters(
		[{ type: "bytes32" }, { type: "uint256" }],
		[withdrawalHash, 0n],
	);
	return keccak256(data);
}
