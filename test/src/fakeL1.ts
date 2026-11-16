/* c8 ignore start */
// Offline fake L1 used by `*.unit.test.ts`: answers `eth_call` for the
// L2OutputOracle (directly and through Multicall3 `aggregate3`) and for the
// portal `version()` getter. No network, no anvil, no viem retries.

import {
	type Address,
	createClient,
	custom,
	decodeFunctionData,
	encodeAbiParameters,
	type Hex,
	multicall3Abi,
	type TransactionReceipt,
} from "viem";
import { mainnet } from "viem/chains";
import { l2OutputOracleAbi, portal2Abi } from "../../src/mantle/abis.js";

export const oracleAddress: Address =
	"0x0000000000000000000000000000000000000a01";

export type FakeOutput = {
	l2BlockNumber: bigint;
	/** L1 timestamp (seconds) of the output proposal. */
	timestamp: bigint;
};

export type FakeL1 = {
	/** Committed outputs; the last entry is the latest output. */
	outputs: FakeOutput[];
	submissionInterval: bigint;
	l2BlockTime: bigint;
	/** Portal `version()` result keyed by lower-cased portal address. */
	portalVersions?: Record<string, string> | undefined;
	/** Throws instead of answering portal `version()` calls. */
	portalError?: Error | undefined;
};

export type RpcCall = { to: Address; functionName: string };

function encodeOutputs(
	abi: readonly { type: string; name?: string; outputs?: readonly unknown[] }[],
	functionName: string,
	value: unknown,
): Hex {
	const item = abi.find(
		(x) => x.type === "function" && x.name === functionName,
	);
	if (!item?.outputs) throw new Error(`unknown function ${functionName}`);
	return encodeAbiParameters(item.outputs as any, [value] as any);
}

function answer(state: FakeL1, to: Address, data: Hex, calls: RpcCall[]): Hex {
	if (to.toLowerCase() === oracleAddress) {
		const { functionName, args } = decodeFunctionData({
			abi: l2OutputOracleAbi,
			data,
		});
		calls.push({ to, functionName });
		switch (functionName) {
			case "latestOutputIndex":
				return encodeOutputs(
					l2OutputOracleAbi,
					functionName,
					BigInt(state.outputs.length - 1),
				);
			case "L2_BLOCK_TIME":
				return encodeOutputs(
					l2OutputOracleAbi,
					functionName,
					state.l2BlockTime,
				);
			case "SUBMISSION_INTERVAL":
				return encodeOutputs(
					l2OutputOracleAbi,
					functionName,
					state.submissionInterval,
				);
			case "getL2Output": {
				const output = state.outputs[Number((args as readonly [bigint])[0])];
				if (!output) throw new Error("fake oracle: output index out of range");
				return encodeOutputs(l2OutputOracleAbi, functionName, {
					outputRoot: `0x${"11".repeat(32)}`,
					timestamp: output.timestamp,
					l2BlockNumber: output.l2BlockNumber,
				});
			}
			default:
				throw new Error(`fake oracle: unsupported ${functionName}`);
		}
	}

	const version = state.portalVersions?.[to.toLowerCase()];
	if (version !== undefined || state.portalError) {
		const { functionName } = decodeFunctionData({ abi: portal2Abi, data });
		calls.push({ to, functionName });
		if (state.portalError) throw state.portalError;
		return encodeOutputs(portal2Abi, functionName, version);
	}

	throw new Error(`fake L1: unexpected eth_call to ${to}`);
}

/** Creates an L1 client (mainnet chain, so Multicall3 is configured). */
export function createFakeL1Client(state: FakeL1) {
	const calls: RpcCall[] = [];
	const multicall3 = mainnet.contracts.multicall3.address.toLowerCase();
	const client = createClient({
		chain: mainnet,
		transport: custom(
			{
				async request({ method, params }: { method: string; params?: any }) {
					if (method !== "eth_call")
						throw new Error(`fake L1: unsupported ${method}`);
					const [{ to, data }] = params as [{ to: Address; data: Hex }];
					if (to.toLowerCase() !== multicall3)
						return answer(state, to, data, calls);

					const { args } = decodeFunctionData({ abi: multicall3Abi, data });
					const inner = (
						args as readonly [readonly { target: Address; callData: Hex }[]]
					)[0];
					const results = inner.map(({ target, callData }) => ({
						success: true,
						returnData: answer(state, target, callData, calls),
					}));
					return encodeOutputs(multicall3Abi, "aggregate3", results);
				},
			},
			{ retryCount: 0 },
		),
	});
	return { client, calls };
}

/** Minimal receipt for actions that only read `blockNumber`. */
export function receiptAt(blockNumber: bigint) {
	return { blockNumber } as TransactionReceipt;
}
/* c8 ignore stop */
