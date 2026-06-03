import type { TransactionRequestEIP1559 } from "viem";
import { createClient, custom, hexToBigInt, numberToHex } from "viem";
import { parseEther, parseGwei } from "viem/utils";
import { expect, test } from "vitest";
import { anvilMantle } from "../../../test/src/anvil.js";
import { accounts } from "../../../test/src/constants.js";
import { mantle } from "../chains/index.js";
import { estimateTotalFee } from "./estimateTotalFee.js";

const mantleClient = anvilMantle.getClient();
const mantleClientWithAccount = anvilMantle.getClient({ account: true });
const mantleClientWithoutChain = anvilMantle.getClient({ chain: false });

// Deterministic value returned by the `eth_estimateTotalFee` stub in
// test/src/anvil.ts (anvil cannot serve Mantle's custom RPC method).
const STUB_FEE = hexToBigInt("0x4e76c6682f866");

const baseTransaction = {
	maxFeePerGas: parseGwei("100"),
	maxPriorityFeePerGas: parseGwei("1"),
	to: accounts[1].address,
	value: parseEther("0.1"),
} as const satisfies Omit<TransactionRequestEIP1559, "from">;

test("default", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, baseTransaction);
	expect(fee).toBe(STUB_FEE);
});

test("minimal", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {});
	expect(fee).toBe(STUB_FEE);
});

test("args: account", async () => {
	const fee = await estimateTotalFee(mantleClient, {
		...baseTransaction,
		account: accounts[0].address,
	});
	expect(fee).toBe(STUB_FEE);
});

test("args: data", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		data: "0x00000000000000000000000000000000000000000000000004fefa17b7240000",
	});
	expect(fee).toBe(STUB_FEE);
});

test("args: nonce", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		nonce: 69,
	});
	expect(fee).toBe(STUB_FEE);
});

test("args: nullish chain", async () => {
	const fee = await estimateTotalFee(mantleClientWithoutChain, {
		...baseTransaction,
		account: accounts[0].address,
		chain: null,
	});
	expect(fee).toBe(STUB_FEE);
});

test("returns bigint", async () => {
	const totalFee = await estimateTotalFee(
		mantleClientWithAccount,
		baseTransaction,
	);
	expect(typeof totalFee).toBe("bigint");
	expect(totalFee).toBeGreaterThan(0n);
});

test("encodes request params and does not leak client-only fields", async () => {
	let captured: Record<string, unknown> | undefined;
	const client = createClient({
		chain: mantle,
		transport: custom({
			async request({ method, params }) {
				if (method === "eth_estimateTotalFee") {
					captured = (params as Record<string, unknown>[])[0];
					return "0x4e76c6682f866";
				}
				throw new Error(`unexpected method: ${method}`);
			},
		}),
	});

	const fee = await estimateTotalFee(client, {
		account: accounts[0].address,
		to: accounts[1].address,
		value: parseEther("1"),
		maxFeePerGas: parseGwei("100"),
		maxPriorityFeePerGas: parseGwei("1"),
		nonce: 7,
		// `chain` is a client-only override — it must NOT reach the RPC payload.
		chain: null,
	});

	expect(fee).toBe(STUB_FEE);
	expect(captured).toBeDefined();

	// Numeric fields are hex-encoded (not raw bigint / number).
	expect(captured?.value).toBe(numberToHex(parseEther("1")));
	expect(captured?.maxFeePerGas).toBe(numberToHex(parseGwei("100")));
	expect(captured?.maxPriorityFeePerGas).toBe(numberToHex(parseGwei("1")));
	expect(captured?.nonce).toBe(numberToHex(7));

	// `from` is derived from the account; `to` is passed through.
	expect((captured?.from as string).toLowerCase()).toBe(
		accounts[0].address.toLowerCase(),
	);
	expect(captured?.to).toBe(accounts[1].address);

	// Client-only / non-transaction fields must NOT be forwarded to the node.
	expect(captured).not.toHaveProperty("chain");
	expect(captured).not.toHaveProperty("account");
});

test("drops non-standard op-stack override fields — not forwarded to the node", async () => {
	let captured: Record<string, unknown> | undefined;
	const client = createClient({
		chain: mantle,
		transport: custom({
			async request({ method, params }) {
				if (method === "eth_estimateTotalFee") {
					captured = (params as Record<string, unknown>[])[0];
					return "0x4e76c6682f866";
				}
				throw new Error(`unexpected method: ${method}`);
			},
		}),
	});

	// `gasPriceOracleAddress` / `l1BlockAddress` are viem op-stack overrides that
	// the node-side `eth_estimateTotalFee` does not accept. They are not part of
	// the typed params (passed via `as any`) and must be dropped, not forwarded.
	await estimateTotalFee(client, {
		account: accounts[0].address,
		to: accounts[1].address,
		value: parseEther("1"),
		gasPriceOracleAddress: "0x420000000000000000000000000000000000000F",
		l1BlockAddress: "0x4200000000000000000000000000000000000015",
	} as any);

	expect(captured).toBeDefined();
	expect(captured).not.toHaveProperty("gasPriceOracleAddress");
	expect(captured).not.toHaveProperty("l1BlockAddress");
	// The standard fields still come through.
	expect(captured?.to).toBe(accounts[1].address);
	expect(captured?.value).toBe(numberToHex(parseEther("1")));
});
