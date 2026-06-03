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
import { estimateInitiateETHWithdrawalFee } from "./estimateInitiateETHWithdrawalFee.js";

// L2 ETH sentinel token address used by the bridge withdraw call.
const ETH_L2_TOKEN = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111";

const mantleClientWithAccount = anvilMantle.getClient({ account: true });

// Deterministic value returned by the `eth_estimateTotalFee` stub in
// test/src/anvil.ts (anvil cannot serve Mantle's custom RPC method).
const STUB_FEE = hexToBigInt("0x4e76c6682f866");

test("default", async () => {
	const fee = await estimateInitiateETHWithdrawalFee(mantleClientWithAccount, {
		account: accounts[0].address,
		request: { amount: parseEther("1") },
	});
	expect(typeof fee).toBe("bigint");
	expect(fee).toBe(STUB_FEE);
});

test("encodes the bridge withdraw call with NO msg.value", async () => {
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
	const fee = await estimateInitiateETHWithdrawalFee(client, {
		account: accounts[0].address,
		request: { amount },
	});

	expect(fee).toBe(STUB_FEE);
	expect(captured?.to).toBe(contracts.l2StandardBridge.address);
	expect(captured?.data).toBe(
		encodeFunctionData({
			abi: l2StandardBridge,
			functionName: "withdraw",
			args: [ETH_L2_TOKEN, amount, 0, "0x"],
		}),
	);
	// ETH withdrawal carries no msg.value.
	expect(captured).not.toHaveProperty("value");
});
