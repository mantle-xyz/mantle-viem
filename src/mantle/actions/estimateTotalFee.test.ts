import type { TransactionRequestEIP1559 } from "viem";
import { parseEther, parseGwei } from "viem/utils";
import { expect, test } from "vitest";
import { anvilMantle } from "../../../test/src/anvil.js";
import { accounts } from "../../../test/src/constants.js";
import { estimateTotalFee } from "./estimateTotalFee.js";

const mantleClient = anvilMantle.getClient();
const mantleClientWithAccount = anvilMantle.getClient({ account: true });
const mantleClientWithoutChain = anvilMantle.getClient({ chain: false });

const baseTransaction = {
	maxFeePerGas: parseGwei("100"),
	maxPriorityFeePerGas: parseGwei("1"),
	to: accounts[1].address,
	value: parseEther("0.1"),
} as const satisfies Omit<TransactionRequestEIP1559, "from">;

test("default", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, baseTransaction);
	expect(fee).toBeDefined();
});

test("minimal", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {});
	expect(fee).toBeDefined();
});

test("args: account", async () => {
	const fee = await estimateTotalFee(mantleClient, {
		...baseTransaction,
		account: accounts[0].address,
	});
	expect(fee).toBeDefined();
});

test("args: data", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		data: "0x00000000000000000000000000000000000000000000000004fefa17b7240000",
	});
	expect(fee).toBeDefined();
});

test("args: feePriceOracleAddress", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		gasPriceOracleAddress: "0x420000000000000000000000000000000000000F",
	});
	expect(fee).toBeDefined();
});

test("args: nonce", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		nonce: 69,
	});
	expect(fee).toBeDefined();
});

test("args: l1BlockAddress", async () => {
	const fee = await estimateTotalFee(mantleClientWithAccount, {
		...baseTransaction,
		l1BlockAddress: "0x4200000000000000000000000000000000000015",
	});
	expect(fee).toBeDefined();
});

test("args: nullish chain", async () => {
	const fee = await estimateTotalFee(mantleClientWithoutChain, {
		...baseTransaction,
		account: accounts[0].address,
		chain: null,
	});
	expect(fee).toBeDefined();
});

test("returns bigint", async () => {
	const totalFee = await estimateTotalFee(
		mantleClientWithAccount,
		baseTransaction,
	);
	expect(typeof totalFee).toBe("bigint");
	expect(totalFee).toBeGreaterThan(0n);
});
