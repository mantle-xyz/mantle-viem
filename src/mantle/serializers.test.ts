import { keccak256, parseEther, parseGwei } from "viem";
import { describe, expect, test } from "vitest";
import { accounts } from "../../test/src/constants.js";
import { parseTransaction } from "./parsers.js";
import { serializeTransaction } from "./serializers.js";
import type { TransactionSerializableDeposit } from "./types/transaction.js";

describe("deposit", async () => {
	const mantleTransaction = {
		from: "0x977f82a600a1414e583f7f13623f1ac5d58b1c0b",
		sourceHash:
			"0x18040f35752170c3339ddcd850f185c9cc46bdef4d6e1f2ab323f4d3d7104319",
		type: "deposit",
	} as const satisfies TransactionSerializableDeposit;

	test("default", () => {
		const serialized = serializeTransaction(mantleTransaction);
		expect(parseTransaction(serialized)).toEqual(mantleTransaction);
	});

	test("args: data", () => {
		const tx = {
			...mantleTransaction,
			data: "0xdeadbeef",
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: gas", () => {
		const tx = {
			...mantleTransaction,
			gas: 69420n,
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: isSystemTx", () => {
		const tx = {
			...mantleTransaction,
			isSystemTx: true,
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: mint", () => {
		const tx = {
			...mantleTransaction,
			mint: 69420n,
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: to", () => {
		const tx = {
			...mantleTransaction,
			to: "0xaabbccddeeff00112233445566778899aabbccdd",
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: value", () => {
		const tx = {
			...mantleTransaction,
			value: 69420n,
		} as const satisfies TransactionSerializableDeposit;
		const serialized = serializeTransaction(tx);
		expect(parseTransaction(serialized)).toEqual(tx);
	});

	test("args: no type", () => {
		const serialized = serializeTransaction({
			...mantleTransaction,
			type: undefined,
		} as any);
		expect(serialized).toMatchInlineSnapshot(
			'"0x7ef83da018040f35752170c3339ddcd850f185c9cc46bdef4d6e1f2ab323f4d3d710431994977f82a600a1414e583f7f13623f1ac5d58b1c0b80808080808080"',
		);
	});

	test("error: invalid to", () => {
		const tx = {
			...mantleTransaction,
			to: "0xaabbccddeeff00112233445566778899aabbccd",
		} as const satisfies TransactionSerializableDeposit;
		expect(() => serializeTransaction(tx)).toThrowError(
			/Address "0xaabbccddeeff00112233445566778899aabbccd" is invalid/,
		);
	});

	test("error: invalid from", () => {
		const tx = {
			...mantleTransaction,
			from: "0xaabbccddeeff00112233445566778899aabbccd",
		} as const satisfies TransactionSerializableDeposit;
		expect(() => serializeTransaction(tx)).toThrowError(
			/Address "0xaabbccddeeff00112233445566778899aabbccd" is invalid/,
		);
	});

	test("e2e", async () => {
		const hash =
			"0xb44587742995319898a6d7241e2e6b749e6d570efb34f9f359572b2f7367ca92";
		expect(
			keccak256(
				serializeTransaction({
					from: "0x48ebc5312e31adb8bb0802fc72ca84da5cdfdc5d",
					sourceHash:
						"0x635b2d77d1cd913eb3ccb4ae7749234a79b618e4726093677f1a05bbf9ac7c80",
					to: "0x4200000000000000000000000000000000000007",
					mint: 800000000000000000000n,
					value: 800000000000000000000n,
					gas: 591926n,
					ethValue: 0n,
					data: "0xff8daf15000100000000000000000000000000000000000000000000000000000000f75f00000000000000000000000021f308067241b2028503c07bd7cb3751ffab0fb2000000000000000000000000420000000000000000000000000000000000001000000000000000000000000000000000000000000000002b5e3af16b1880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000a4f407a99e0000000000000000000000001dae2593c1ea98840882e8c7c4b0509415aff1c10000000000000000000000001dae2593c1ea98840882e8c7c4b0509415aff1c100000000000000000000000000000000000000000000002b5e3af16b188000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
					type: "deposit",
				} as TransactionSerializableDeposit),
			),
		).toEqual(hash);
	});
});

describe("eip1559", async () => {
	test("default", async () => {
		const transaction = {
			to: accounts[0].address,
			chainId: 1,
			nonce: 69,
			maxFeePerGas: parseGwei("2"),
			maxPriorityFeePerGas: parseGwei("2"),
			type: "eip1559",
			value: parseEther("1"),
		} as const;

		const serialized = serializeTransaction(transaction);
		expect(parseTransaction(serialized)).toEqual(transaction);
	});
});
