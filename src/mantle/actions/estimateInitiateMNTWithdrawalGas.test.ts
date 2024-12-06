import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect, test } from "vitest";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { estimateInitiateMNTWithdrawalGas } from "./estimateInitiateMNTWithdrawalGas.js";

test("e2e estimate withdraw mnt gas", async () => {
	const account = privateKeyToAccount(
		process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
	);

	const client_mantle_sepolia = createClient({
		chain: mantleSepoliaTestnet,
		transport: http(),
	});

	const gas = await estimateInitiateMNTWithdrawalGas(client_mantle_sepolia, {
		request: {
			amount: parseEther("0.001"),
		},
		account: account.address,
	});

	expect(gas).toBeDefined();
});
