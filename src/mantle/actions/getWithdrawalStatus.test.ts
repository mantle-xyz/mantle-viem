import { createClient, http, publicActions } from "viem";
import { getTransactionReceipt, reset } from "viem/actions";
import { expect, test, vi } from "vitest";
import {
	anvilMainnet,
	anvilMantle,
	anvilMantleSepolia,
	anvilSepolia,
} from "~test/src/anvil.js";

import { mantle } from "../chains/index.js";
import { ReceiptContainsNoWithdrawalsError } from "../errors/withdrawal.js";
import { buildMigratedWithdrawal } from "./buildMigratedWithdrawal.js";
import { getWithdrawalStatus } from "./getWithdrawalStatus.js";
const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();
const mainnetClient = anvilMainnet.getClient();
// Read-only upstream client for the legacy tx receipt + reconstruction (mirrors
// buildMigratedWithdrawal.test): immutable history, no fork state is read.
const mantleClient = createClient({
	chain: mantle,
	transport: http(anvilMantle.forkUrl),
}).extend(publicActions);

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

	// `getTimeToFinalize` is computed from `Date.now()` vs the on-chain prove
	// timestamp (1725556872) against the 1h finalization window, so without a
	// fixed clock this withdrawal eventually reads "ready-to-finalize" once real
	// time passes the window. Freeze "now" to 60s after the prove (well within
	// the window) to keep it deterministically "waiting-to-finalize".
	vi.setSystemTime(new Date(1725556932000));

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0x0ced33e811485677bc0775bf430d9b3262bad3c630dc386883a4ac84a698b064",
	});

	const status = await getWithdrawalStatus(sepoliaClient, {
		receipt,
		targetChain: mantleSepoliaClient.chain,
	});
	expect(status).toBe("waiting-to-finalize");

	vi.useRealTimers();
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

test(
	"migrated (pre-Tectonic) withdrawal: resolves status when `withdrawal` is passed",
	async () => {
		// A V1/OVM MNT withdrawal migrated into the Bedrock L2ToL1MessagePasser at
		// the Tectonic upgrade: its receipt has no `MessagePassed` event, so
		// `getWithdrawals(receipt)` is empty. Callers reconstruct it with
		// `buildMigratedWithdrawal` and pass it via the `withdrawal` parameter.
		// https://mantlescan.xyz/tx/0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76
		const legacyTxHash =
			"0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76";
		const receipt = await getTransactionReceipt(mantleClient, {
			hash: legacyTxHash,
		});
		const withdrawal = await buildMigratedWithdrawal(mantleClient, {
			legacyTxHash,
		});

		const status = await getWithdrawalStatus(mainnetClient, {
			receipt,
			withdrawal,
			targetChain: mantle,
		});
		expect(status).toBe("ready-to-prove");
	},
	30_000,
);

test(
	"migrated withdrawal: still throws when no `withdrawal` is provided (backward compat)",
	async () => {
		// Without the reconstructed withdrawal the receipt yields nothing, so the
		// original behaviour is preserved: existing callers are unaffected.
		const receipt = await getTransactionReceipt(mantleClient, {
			hash: "0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76",
		});

		await expect(
			getWithdrawalStatus(mainnetClient, {
				receipt,
				targetChain: mantle,
			}),
		).rejects.toThrowError(ReceiptContainsNoWithdrawalsError);
	},
	30_000,
);
