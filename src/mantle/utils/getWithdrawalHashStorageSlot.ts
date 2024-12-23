import type { ErrorType } from "../../errors/utils.js";
import type { Hash } from "../../types/misc.js";
import {
	encodeAbiParameters,
	type EncodeAbiParametersErrorType,
} from "../../utils/abi/encodeAbiParameters.js";
import {
	keccak256,
	type Keccak256ErrorType,
} from "../../utils/hash/keccak256.js";

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
