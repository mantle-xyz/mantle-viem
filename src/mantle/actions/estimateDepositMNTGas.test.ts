import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { expect, test } from "vitest";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { estimateDepositMNTGas } from "./estimateDepositMNTGas.js";

test("e2e mnt", async () => {
	const account = privateKeyToAccount(
		process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
	);

	const client_sepolia = createClient({
		chain: sepolia,
		transport: http(),
	});

	const gas = await estimateDepositMNTGas(client_sepolia, {
		request: {
			amount: parseEther("0.001"),
		},
		targetChain: mantleSepoliaTestnet,
		account,
	});

	expect(gas).toBeDefined();
});
