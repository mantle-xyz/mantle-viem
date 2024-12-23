import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect, test } from "vitest";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { estimateInitiateERC20Withdrawal } from "./estimateInitiateERC20WithdrawalGas.js";

test("e2e estimate withdraw erc20 gas", async () => {
	const account = privateKeyToAccount(
		process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
	);

	const client_mantle_sepolia = createClient({
		chain: mantleSepoliaTestnet,
		transport: http(),
	});

	const gas = await estimateInitiateERC20Withdrawal(client_mantle_sepolia, {
		request: {
			amount: parseEther("0.0001"),
			l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828",
		},
		account: account.address,
	});

	expect(gas).toBeDefined();
});
