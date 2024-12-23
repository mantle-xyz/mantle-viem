import type { Address, Hex } from "viem";
import { l1StandardBridge } from "../abis.js";

export const depositABI = l1StandardBridge;
export const depositErc20Function = "depositERC20To";
export const l1StandardBridgeName = "l1StandardBridge";

export type DepositERC20Parameters = {
	/** Gas limit for transaction execution on the L2. Default as 20000 */
	minGasLimit?: bigint | undefined;
	/** Value in wei of tokens to deposit. */
	amount: bigint;
	/** Extra data to include in the transaction. */
	extraData?: Hex | undefined;
	/** L2 Transaction recipient. */
	to?: Address | undefined;
	/** ERC20 L1 Token Address. */
	l1Token: Address;
	/** ERC20 L2 Token Address. */
	l2Token: Address;
};
