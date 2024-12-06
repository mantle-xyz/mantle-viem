import { type Address, zeroAddress } from "viem";

export const parseWithdrawL2Token = (l2Token?: Address) => {
	if (!l2Token) return zeroAddress;
	return l2Token;
};
