import {
	hexToBigInt,
	size,
	type SizeErrorType,
	slice,
	type SliceErrorType,
} from "viem";
import type { Hex } from "viem";
import type { ErrorType } from "../errors/utils.js";

export type OpaqueDataToDepositDataParameters = Hex;

export type OpaqueDataToDepositDataReturnType = {
	mint: bigint;
	value: bigint;
	gas: bigint;
	isCreation: boolean;
	data: Hex;
	ethValue: bigint;
	ethTxValue: bigint;
};

export type OpaqueDataToDepositDataErrorType =
	| SliceErrorType
	| SizeErrorType
	| ErrorType;

export function opaqueDataToDepositData(
	opaqueData: Hex,
): OpaqueDataToDepositDataReturnType {
	let offset = 0;
	const mint = slice(opaqueData, offset, offset + 32);
	offset += 32;
	const value = slice(opaqueData, offset, offset + 32);
	offset += 32;
	const ethValue = slice(opaqueData, offset, offset + 32);
	offset += 32;
	const ethTxValue = slice(opaqueData, offset, offset + 32);
	offset += 32;
	const gas = slice(opaqueData, offset, offset + 8);
	offset += 8;
	const isCreation =
		BigInt(slice(opaqueData, offset, offset + 1)) === BigInt(1);
	offset += 1;
	const data =
		offset > size(opaqueData) - 1
			? "0x"
			: slice(opaqueData, offset, opaqueData.length);
	return {
		mint: hexToBigInt(mint),
		value: hexToBigInt(value),
		gas: hexToBigInt(gas),
		isCreation,
		data,
		ethValue: hexToBigInt(ethValue),
		ethTxValue: hexToBigInt(ethTxValue),
	};
}
