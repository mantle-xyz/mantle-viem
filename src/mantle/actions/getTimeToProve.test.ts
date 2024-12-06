import { getTransactionReceipt, reset } from "viem/actions";
import { expect, test } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";

import { getTimeToProve } from "./getTimeToProve.js";

const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

test("default", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6626270n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997559n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	// https://sepolia.mantlescan.xyz/tx/0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb
	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb",
	});

	const time = await getTimeToProve(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});

	expect(time).toBeDefined();
});
