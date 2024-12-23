import type { Log } from "viem";
import type { Hex } from "viem";
import type { ErrorType } from "../errors/utils.js";
import { extractTransactionDepositedLogs } from "./extractTransactionDepositedLogs.js";
import { getL2TransactionHash } from "./getL2TransactionHash.js";

export type GetL2TransactionHashesParameters = {
	/** The L1 transaction receipt logs. */
	logs: Log[];
};

export type GetL2TransactionHashesReturnType = Hex[];

export type GetL2TransactionHashesErrorType = ErrorType;

export function getL2TransactionHashes({
	logs,
}: GetL2TransactionHashesParameters): GetL2TransactionHashesReturnType {
	const extractedLogs = extractTransactionDepositedLogs({ logs });
	return extractedLogs.map((log) => getL2TransactionHash({ log }));
}
