import { getTransactionReceipt, reset } from "viem/actions";
import { beforeAll, test, vi } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";

import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { getWithdrawals } from "../utils/getWithdrawals.js";
import { waitToFinalize } from "./waitToFinalize.js";

const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

beforeAll(async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638346n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997560n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});
});

test("default", async () => {
	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb",
	});

	const [withdrawal] = getWithdrawals(receipt);

	vi.setSystemTime(new Date(1702993989000));

	await waitToFinalize(sepoliaClient, {
		...withdrawal!,
		targetChain: mantleSepoliaTestnet,
	});

	vi.useRealTimers();
}, 20000);

test("ready to finalize", async () => {
	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x90a949af815b4715ff6686a0dbafec0d3d9d7c33fe9911a3d172b5584e9f6cbb",
	});

	const [withdrawal] = getWithdrawals(receipt);

	vi.setSystemTime(new Date(1702993991000));

	await waitToFinalize(sepoliaClient, {
		...withdrawal!,
		targetChain: mantleSepoliaTestnet,
	});

	vi.useRealTimers();
}, 20000);
