import type { Address, Hex } from "viem";
import type { InitialteWithdrawalRequest } from "../types/withdrawal.js";

export type InitWithdrawFunctionName = "withdraw" | "withdrawTo";
export type WithdrawArgs =
	| [Address, bigint, number, Hex]
	| [Address, Address, bigint, number, Hex];
type ParseWithdrawRequestReturnType = {
	functionName: InitWithdrawFunctionName;
	args: WithdrawArgs;
};

export const parseInitWithdrawequest = ({
	type,
	l2Token,
	amount,
	to,
}: InitialteWithdrawalRequest): ParseWithdrawRequestReturnType => {
	if (to) {
		switch (type) {
			case "eth":
				return {
					functionName: "withdrawTo",
					args: [
						"0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
						to,
						amount,
						0,
						"0x",
					],
				};
			case "erc20":
				return {
					functionName: "withdrawTo",
					args: [l2Token, to, amount, 0, "0x"],
				};
			default:
				return {
					functionName: "withdrawTo",
					args: [
						"0x0000000000000000000000000000000000000000",
						to,
						amount,
						0,
						"0x",
					],
				};
		}
	}

	switch (type) {
		case "eth":
			return {
				functionName: "withdraw",
				args: ["0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111", amount, 0, "0x"],
			};
		case "erc20":
			return {
				functionName: "withdraw",
				args: [l2Token, amount, 0, "0x"],
			};
		default:
			return {
				functionName: "withdraw",
				args: ["0x0000000000000000000000000000000000000000", amount, 0, "0x"],
			};
	}
};
