import { expect, test } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";

import { getTransactionReceipt, reset } from "viem/actions";
import { buildProveWithdrawal } from "./buildProveWithdrawal.js";
import { estimateProveWithdrawalGas } from "./estimateProveWithdrawalGas.js";
import { waitToProve } from "./waitToProve.js";

const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

test("default", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638345n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997809n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	// https://sepolia.mantlescan.xyz/tx/0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb
	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb",
	});

	const { withdrawal, output } = await waitToProve(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});

	const request = await buildProveWithdrawal(mantleSepoliaClient, {
		account: accounts[0].address,
		output,
		withdrawal: withdrawal!,
	});
	expect(request).toEqual(mantleSepoliaClient.chain);

	const { targetChain } = request;
	expect(targetChain).toEqual(mantleSepoliaClient.chain);

	const gas = await estimateProveWithdrawalGas(sepoliaClient, request);

	expect(gas).toBeDefined();
});
