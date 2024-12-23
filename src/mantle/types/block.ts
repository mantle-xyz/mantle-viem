import type { Block, BlockTag } from "viem";
import type { Hash } from "viem";
import type { RpcBlock } from "viem";
import type {
	OpStackRpcTransaction,
	OpStackTransaction,
} from "./transaction.js";

export type OpStackBlockOverrides = {
	stateRoot: Hash;
};
export type OpStackBlock<
	includeTransactions extends boolean = boolean,
	blockTag extends BlockTag = BlockTag,
> = Block<
	bigint,
	includeTransactions,
	blockTag,
	OpStackTransaction<blockTag extends "pending" ? true : false>
> &
	OpStackBlockOverrides;

export type OpStackRpcBlockOverrides = {
	stateRoot: Hash;
};
export type OpStackRpcBlock<
	blockTag extends BlockTag = BlockTag,
	includeTransactions extends boolean = boolean,
> = RpcBlock<
	blockTag,
	includeTransactions,
	OpStackRpcTransaction<blockTag extends "pending" ? true : false>
> &
	OpStackRpcBlockOverrides;
