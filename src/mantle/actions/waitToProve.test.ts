import { getTransactionReceipt, reset } from "viem/actions";
import { expect, test } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";

import { waitToProve } from "./waitToProve.js";

const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

test("default", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638346n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997560n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	// https://sepolia.mantlescan.xyz/tx/0x3fa6605e2c54cba8a8ef5ea83649f4c580b119fcf1fbaef15dcce855a11b3231
	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x3fa6605e2c54cba8a8ef5ea83649f4c580b119fcf1fbaef15dcce855a11b3231",
	});

	const output = await waitToProve(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(output).toBe("");
	expect(output).toBeDefined();
});
