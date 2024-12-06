import type { Address, Hex } from "viem";
import type { DepositRequest } from "../types/deposit.js";

export type DepositFunctionName = "depositETH" | "depositERC20" | "depositMNT";
export type DepositArgs =
	| [number, Hex]
	| [Address, Address, bigint, number, Hex]
	| [bigint, number, Hex];
type ParseDepositRequestReturnType = {
	functionName: DepositFunctionName;
	args: DepositArgs;
};

export const parseDepositRequest = ({
	type,
	l1Token,
	l2Token,
	amount,
}: DepositRequest): ParseDepositRequestReturnType => {
	switch (type) {
		case "eth":
			return {
				functionName: "depositETH",
				args: [200000, "0x"],
			};
		case "erc20":
			return {
				functionName: "depositERC20",
				args: [l1Token, l2Token, amount, 200000, "0x"],
			};
		default:
			return {
				functionName: "depositMNT",
				args: [amount, 200000, "0x"],
			};
	}
};
