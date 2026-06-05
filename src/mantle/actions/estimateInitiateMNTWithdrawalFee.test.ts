import {
	createClient,
	custom,
	encodeFunctionData,
	hexToBigInt,
	numberToHex,
	parseEther,
	zeroAddress,
} from "viem";
import { expect, test } from "vitest";
import { anvilMantle } from "../../../test/src/anvil.js";
import { accounts } from "../../../test/src/constants.js";
import { l2StandardBridge } from "../abis.js";
import { mantle } from "../chains/index.js";
import { contracts } from "../contracts.js";
import { estimateInitiateMNTWithdrawalFee } from "./estimateInitiateMNTWithdrawalFee.js";

const mantleClientWithAccount = anvilMantle.getClient({ account: true });

// Deterministic value returned by the `eth_estimateTotalFee` stub in
// test/src/anvil.ts (anvil cannot serve Mantle's custom RPC method).
const STUB_FEE = hexToBigInt("0x4e76c6682f866");

test("default", async () => {
	const fee = await estimateInitiateMNTWithdrawalFee(mantleClientWithAccount, {
		account: accounts[0].address,
		request: { amount: parseEther("1") },
	});
	expect(typeof fee).toBe("bigint");
	expect(fee).toBe(STUB_FEE);
});

test("encodes the bridge withdraw call with MNT amount as msg.value", async () => {
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

	const amount = parseEther("1");
	const fee = await estimateInitiateMNTWithdrawalFee(client, {
		account: accounts[0].address,
		request: { amount },
	});

	expect(fee).toBe(STUB_FEE);
	expect(captured?.to).toBe(contracts.l2StandardBridge.address);
	expect(captured?.data).toBe(
		encodeFunctionData({
			abi: l2StandardBridge,
			functionName: "withdraw",
			args: [zeroAddress, amount, 0, "0x"],
		}),
	);
	// MNT is the native L2 token, so the amount is sent as `msg.value`.
	expect(captured?.value).toBe(numberToHex(amount));
});

test("withdrawTo encodes the recipient", async () => {
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

	const amount = parseEther("1");
	await estimateInitiateMNTWithdrawalFee(client, {
		account: accounts[0].address,
		request: { amount, to: accounts[1].address },
	});

	expect(captured?.data).toBe(
		encodeFunctionData({
			abi: l2StandardBridge,
			functionName: "withdrawTo",
			args: [zeroAddress, accounts[1].address, amount, 0, "0x"],
		}),
	);
	expect(captured?.value).toBe(numberToHex(amount));
});
