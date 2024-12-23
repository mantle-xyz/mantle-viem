import type { Address, Hex } from "viem";
import type { DepositRequest } from "../types/deposit.js";

export type DepositFunctionName =
	| "depositETH"
	| "depositERC20"
	| "depositMNT"
	| "depositETHTo"
	| "depositERC20To"
	| "depositMNTTo";
export type DepositArgs =
	| [number, Hex]
	| [Address, Address, bigint, number, Hex]
	| [bigint, number, Hex]
	| [Address, number, Hex]
	| [Address, Address, Address, bigint, number, Hex]
	| [Address, bigint, number, Hex];
type ParseDepositRequestReturnType = {
	functionName: DepositFunctionName;
	args: DepositArgs;
};

export const parseDepositRequest = ({
	type,
	l1Token,
	l2Token,
	amount,
	to,
}: DepositRequest): ParseDepositRequestReturnType => {
	if (to) {
		switch (type) {
			case "eth":
				return {
					functionName: "depositETHTo",
					args: [to, 200000, "0x"],
				};
			case "erc20":
				return {
					functionName: "depositERC20To",
					args: [l1Token, l2Token, to, amount, 200000, "0x"],
				};
			default:
				return {
					functionName: "depositMNTTo",
					args: [to, amount, 200000, "0x"],
				};
		}
	}

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
