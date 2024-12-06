import type { Address, Hex } from "viem";
import type { InitialteWithdrawalRequest } from "../types/withdrawal.js";

export type InitWithdrawFunctionName = "withdraw";
export type WithdrawArgs = [Address, bigint, number, Hex];
type ParseWithdrawRequestReturnType = {
	functionName: InitWithdrawFunctionName;
	args: WithdrawArgs;
};

export const parseInitWithdrawequest = ({
	type,
	l2Token,
	amount,
}: InitialteWithdrawalRequest): ParseWithdrawRequestReturnType => {
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
