import {
	concatHex,
	isAddress,
	serializeTransaction as serializeTransaction_,
	type SerializeTransactionErrorType as SerializeTransactionErrorType_,
	toHex,
	toRlp,
} from "viem";
import { InvalidAddressError } from "viem";
import type { ChainSerializers } from "viem";
import type { Hex, Signature } from "viem";
import type { TransactionSerializable } from "viem";
import type { RequiredBy } from "viem";
import type { ErrorType } from "./errors/utils.js";
import type {
	OpStackTransactionSerializable,
	TransactionSerializableDeposit,
	TransactionSerializedDeposit,
} from "./types/transaction.js";

export type SerializeTransactionReturnType = ReturnType<
	typeof serializeTransaction
>;

export type SerializeTransactionErrorType =
	| SerializeTransactionErrorType_
	| ErrorType;

export function serializeTransaction(
	transaction: OpStackTransactionSerializable,
	signature?: Signature,
) {
	if (isDeposit(transaction)) return serializeTransactionDeposit(transaction);
	return serializeTransaction_(
		transaction as TransactionSerializable,
		signature,
	);
}

export const serializers = {
	transaction: serializeTransaction,
} as const satisfies ChainSerializers;

//////////////////////////////////////////////////////////////////////////////
// Serializers

export type SerializeTransactionDepositReturnType =
	TransactionSerializedDeposit;

function serializeTransactionDeposit(
	transaction: TransactionSerializableDeposit,
): SerializeTransactionDepositReturnType {
	assertTransactionDeposit(transaction);

	const {
		sourceHash,
		data,
		from,
		gas,
		isSystemTx,
		mint,
		to,
		value,
		ethValue,
		ethTxValue,
	} = transaction;

	const serializedTransaction: Hex[] = [
		sourceHash,
		from,
		to ?? "0x",
		mint ? toHex(mint) : "0x",
		value ? toHex(value) : "0x",
		gas ? toHex(gas) : "0x",
		isSystemTx ? "0x1" : "0x",
		ethValue ? toHex(ethValue) : "0x",
		data ?? "0x",
	];

	if (ethTxValue) {
		serializedTransaction.push(toHex(ethTxValue));
	}

	return concatHex([
		"0x7e",
		toRlp(serializedTransaction),
	]) as SerializeTransactionDepositReturnType;
}

function isDeposit(
	transaction: OpStackTransactionSerializable,
): transaction is RequiredBy<TransactionSerializableDeposit, "type"> {
	if (transaction.type === "deposit") return true;
	if (typeof transaction.sourceHash !== "undefined") return true;
	return false;
}

export function assertTransactionDeposit(
	transaction: TransactionSerializableDeposit,
) {
	const { from, to } = transaction;
	if (from && !isAddress(from)) {
		throw new InvalidAddressError({ address: from });
	}
	if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
}
