import { createClient, http, publicActions } from "viem";
import { mainnet } from "viem/chains";
import { expect, test } from "vitest";
import { anvilMantle } from "~test/src/anvil.js";
import { mantle } from "../chains/index.js";
import { L1CrossDomainMessengerNotFoundError } from "../errors/withdrawal.js";
import { buildMigratedWithdrawal } from "./buildMigratedWithdrawal.js";

// Read-only, deterministic: a legacy withdrawal tx receipt and its logs are
// immutable history, so a direct upstream client is sufficient (no fork state
// is read). Mirrors the `mainnetClient` pattern in test/src/utils.ts.
const mantleClient = createClient({
	chain: mantle,
	transport: http(anvilMantle.forkUrl),
}).extend(publicActions);

test("builds a Bedrock withdrawal from a pre-Tectonic (migrated) legacy withdrawal", async () => {
	// Mantle mainnet, block 47,460,215 (2024-01-15), a V1/OVM MNT withdrawal that
	// was migrated into the Bedrock L2ToL1MessagePasser at the Tectonic upgrade.
	// https://mantlescan.xyz/tx/0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76
	const withdrawal = await buildMigratedWithdrawal(mantleClient, {
		legacyTxHash:
			"0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76",
	});

	// withdrawalHash is the canonical check: it was verified on-chain to have
	// `sentMessages[hash] == true` in the Bedrock L2ToL1MessagePasser.
	expect(withdrawal.withdrawalHash).toBe(
		"0xe5c26f23d1d72d0606ff9817d6b05cebc7d9a23ab65da744929138445c429c3c",
	);
	expect(withdrawal.nonce).toBe(768268n);
	expect(withdrawal.sender).toBe("0x4200000000000000000000000000000000000007");
	expect(withdrawal.target).toBe("0x676A795fe6E43C17c668de16730c3F690FEB7120");
	expect(withdrawal.mntValue).toBe(10000000n);
	expect(withdrawal.ethValue).toBe(0n);
	expect(withdrawal.gasLimit).toBe(1308105n);
}, 30_000);

test("throws when the L1CrossDomainMessenger address cannot be resolved", async () => {
	const client = createClient({
		chain: mainnet,
		transport: http(),
	}).extend(publicActions);

	await expect(
		buildMigratedWithdrawal(client, {
			legacyTxHash:
				"0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76",
		}),
	).rejects.toThrowError(L1CrossDomainMessengerNotFoundError);
});
