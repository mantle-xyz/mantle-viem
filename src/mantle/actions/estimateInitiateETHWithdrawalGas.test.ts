import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect, test } from "vitest";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { estimateInitiateETHWithdrawalGas } from "./estimateInitiateETHWithdrawalGas.js";

test("e2e estimate withdraw eth gas", async () => {
	const account = privateKeyToAccount(
		process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
	);

	const client_mantle_sepolia = createClient({
		chain: mantleSepoliaTestnet,
		transport: http(),
	});

	const gas = await estimateInitiateETHWithdrawalGas(client_mantle_sepolia, {
		request: {
			amount: parseEther("0.0001"),
		},
		account: account.address,
	});

	expect(gas).toBeDefined();
});
