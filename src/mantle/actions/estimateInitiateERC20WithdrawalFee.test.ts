import {
	createClient,
	custom,
	encodeFunctionData,
	hexToBigInt,
	parseEther,
} from "viem";
import { expect, test } from "vitest";
import { anvilMantle } from "../../../test/src/anvil.js";
import { accounts } from "../../../test/src/constants.js";
import { l2StandardBridge } from "../abis.js";
import { mantle } from "../chains/index.js";
import { contracts } from "../contracts.js";
import { estimateInitiateERC20WithdrawalFee } from "./estimateInitiateERC20WithdrawalFee.js";

const L2_TOKEN = "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828";

const mantleClientWithAccount = anvilMantle.getClient({ account: true });

// Deterministic value returned by the `eth_estimateTotalFee` stub in
// test/src/anvil.ts (anvil cannot serve Mantle's custom RPC method).
const STUB_FEE = hexToBigInt("0x4e76c6682f866");

test("default", async () => {
	const fee = await estimateInitiateERC20WithdrawalFee(
		mantleClientWithAccount,
		{
			account: accounts[0].address,
			request: { amount: parseEther("1"), l2Token: L2_TOKEN },
		},
	);
	expect(typeof fee).toBe("bigint");
	expect(fee).toBe(STUB_FEE);
});

test("encodes the bridge withdraw call with the l2Token and NO msg.value", async () => {
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
	const fee = await estimateInitiateERC20WithdrawalFee(client, {
		account: accounts[0].address,
		request: { amount, l2Token: L2_TOKEN },
	});

	expect(fee).toBe(STUB_FEE);
	expect(captured?.to).toBe(contracts.l2StandardBridge.address);
	expect(captured?.data).toBe(
		encodeFunctionData({
			abi: l2StandardBridge,
			functionName: "withdraw",
			args: [L2_TOKEN, amount, 0, "0x"],
		}),
	);
	// ERC20 withdrawal carries no msg.value.
	expect(captured).not.toHaveProperty("value");
});
