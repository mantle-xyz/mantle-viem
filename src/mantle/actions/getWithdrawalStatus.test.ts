import { getTransactionReceipt, reset } from "viem/actions";
import { expect, test } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";

import { getWithdrawalStatus } from "./getWithdrawalStatus.js";
const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

test.skip("waiting-to-prove", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6626261n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11917259n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x4649507c557704fcb0047a02b90b1b031630336348ed3ebb97210fa9491d8b33",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("waiting-to-prove");
});

test("ready-to-prove", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6626270n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11917259n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x4649507c557704fcb0047a02b90b1b031630336348ed3ebb97210fa9491d8b33",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("ready-to-prove");
});

test("waiting-to-finalize", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638487n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997560n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x0ced33e811485677bc0775bf430d9b3262bad3c630dc386883a4ac84a698b064",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("waiting-to-finalize");
});

test("ready-to-finalize", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638347n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997560n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x02318239d415f32035bfd828143a93a2da34fe12e559bc1ec534e4af785c4bd7",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("ready-to-finalize");
});

test("finalized", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6638347n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997560n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x4514c481bd5aff7c3ecb962dceb12b641b5d98a73ff14a1ce19fdc8c7cd75573",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("finalized");
});
