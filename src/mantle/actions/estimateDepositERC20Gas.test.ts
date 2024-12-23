import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { expect, test } from "vitest";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { estimateDepositERC20Gas } from "./estimateDepositERC20Gas.js";

test.skip("e2e erc20", async () => {
	const account = privateKeyToAccount(
		process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
	);

	const client_sepolia = createClient({
		chain: sepolia,
		transport: http(),
	});

	const gas = await estimateDepositERC20Gas(client_sepolia, {
		request: {
			l1Token: "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c",
			l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828",
			amount: parseEther("0.001"),
		},
		targetChain: mantleSepoliaTestnet,
		account,
	});

	expect(gas).toBeDefined();
});
