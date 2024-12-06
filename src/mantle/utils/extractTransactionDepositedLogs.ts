import { parseEventLogs, type ParseEventLogsErrorType } from "viem";
import type { Log } from "viem";
import { portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";

export type ExtractTransactionDepositedLogsParameters = {
	/** An opaque array of logs. */
	logs: Log[];
};

export type ExtractTransactionDepositedLogsReturnType = Log<
	bigint,
	number,
	false,
	undefined,
	true,
	typeof portalAbi,
	"TransactionDeposited"
>[];

export type ExtractTransactionDepositedLogsErrorType =
	| ParseEventLogsErrorType
	| ErrorType;

export function extractTransactionDepositedLogs({
	logs,
}: ExtractTransactionDepositedLogsParameters) {
	return parseEventLogs({
		abi: portalAbi,
		eventName: "TransactionDeposited",
		logs,
	});
}
