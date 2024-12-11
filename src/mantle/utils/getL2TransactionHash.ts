import { keccak256 } from "viem";
import type { Log } from "viem";
import type { Hex } from "viem";
import type { portalAbi } from "../abis.js";
import type { ErrorType } from "../errors/utils.js";
import { serializeTransaction } from "../serializers.js";
import { getSourceHash } from "./getSourceHash.js";
import { opaqueDataToDepositData } from "./opaqueDataToDepositData.js";

export type GetL2TransactionHashParameters = {
	/** The "TransactionDeposited" log to compute the L2 hash from. */
	log: Log<
		bigint,
		number,
		false,
		undefined,
		true,
		typeof portalAbi,
		"TransactionDeposited"
	>;
};

export type GetL2TransactionHashReturnType = Hex;

export type GetL2TransactionHashErrorType = ErrorType;

export function getL2TransactionHash({ log }: GetL2TransactionHashParameters) {
	const sourceHash = getSourceHash({
		domain: "userDeposit",
		l1BlockHash: log.blockHash,
		l1LogIndex: log.logIndex,
	});
	const { data, gas, isCreation, mint, value, ethValue, ethTxValue } =
		opaqueDataToDepositData(log.args.opaqueData);

	return keccak256(
		serializeTransaction({
			from: log.args.from,
			to: isCreation ? undefined : log.args.to,
			sourceHash,
			data,
			gas,
			isSystemTx: false,
			mint,
			type: "deposit",
			value,
			ethValue,
			ethTxValue,
		}),
	);
}
