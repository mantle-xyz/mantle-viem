import {
	fromRlp,
	type GetSerializedTransactionType,
	type Hex,
	hexToBigInt,
	hexToBool,
	isHex,
	parseTransaction as parseTransaction_,
	type ParseTransactionErrorType as ParseTransactionErrorType_,
	type ParseTransactionReturnType as ParseTransactionReturnType_,
	sliceHex,
} from "viem";
import { InvalidSerializedTransactionError } from "viem";
import type { ErrorType } from "./errors/utils.js";
import { assertTransactionDeposit } from "./serializers.js";
import type {
	OpStackTransactionSerialized,
	OpStackTransactionType,
	TransactionSerializableDeposit,
	TransactionSerializedDeposit,
} from "./types/transaction.js";

export function toTransactionArray(serializedTransaction: string) {
	return fromRlp(`0x${serializedTransaction.slice(4)}` as Hex, "hex");
}

export type ParseTransactionReturnType<
	serialized extends
		OpStackTransactionSerialized = OpStackTransactionSerialized,
	type extends
		OpStackTransactionType = GetSerializedTransactionType<serialized>,
> = serialized extends TransactionSerializedDeposit
	? TransactionSerializableDeposit
	: ParseTransactionReturnType_<serialized, type>;

export type ParseTransactionErrorType = ParseTransactionErrorType_ | ErrorType;

export function parseTransaction<
	serialized extends OpStackTransactionSerialized,
>(serializedTransaction: serialized): ParseTransactionReturnType<serialized> {
	const serializedType = sliceHex(serializedTransaction, 0, 1);

	if (serializedType === "0x7e") {
		return parseTransactionDeposit(
			serializedTransaction as TransactionSerializedDeposit,
		) as ParseTransactionReturnType<serialized>;
	}

	return parseTransaction_(
		serializedTransaction,
	) as ParseTransactionReturnType<serialized>;
}

function parseTransactionDeposit(
	serializedTransaction: TransactionSerializedDeposit,
): ParseTransactionReturnType<TransactionSerializedDeposit> {
	const transactionArray = toTransactionArray(serializedTransaction);

	const [sourceHash, from, to, mint, value, gas, isSystemTx, data] =
		transactionArray;

	if (transactionArray.length !== 8 || !isHex(sourceHash) || !isHex(from)) {
		throw new InvalidSerializedTransactionError({
			attributes: {
				sourceHash,
				from,
				gas,
				to,
				mint,
				value,
				isSystemTx,
				data,
			},
			serializedTransaction,
			type: "deposit",
		});
	}

	const transaction: TransactionSerializableDeposit = {
		sourceHash,
		from,
		type: "deposit",
	};

	if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
	if (isHex(to) && to !== "0x") transaction.to = to;
	if (isHex(mint) && mint !== "0x") transaction.mint = hexToBigInt(mint);
	if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
	if (isHex(isSystemTx) && isSystemTx !== "0x") {
		transaction.isSystemTx = hexToBool(isSystemTx);
	}
	if (isHex(data) && data !== "0x") transaction.data = data;

	assertTransactionDeposit(transaction);

	return transaction;
}
