import { expect, test } from "vitest";

import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { waitForTransactionReceipt } from "viem/actions";
import { sepolia } from "viem/chains";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { getL2TransactionHashes } from "../utils/getL2TransactionHashes.js";
import { depositMNT } from "./depositMNT.js";

test(
	"e2e mnt (sepolia)",
	async () => {
		const account = privateKeyToAccount(
			process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`,
		);

		const client_mantleSepolia = createClient({
			chain: mantleSepoliaTestnet,
			transport: http(),
		});
		const client_sepolia = createClient({
			account,
			chain: sepolia,
			transport: http(process.env.VITE_ANVIL_FORK_URL_SEPOLIA),
		});

		const hash = await depositMNT(client_sepolia, {
			request: {
				amount: parseEther("0.001"),
			},
			targetChain: mantleSepoliaTestnet,
		});

		expect(hash).toBeDefined();

		const receipt = await waitForTransactionReceipt(client_sepolia, {
			hash,
		});

		const [l2Hash] = getL2TransactionHashes(receipt);

		await waitForTransactionReceipt(client_mantleSepolia, {
			hash: l2Hash,
		});
	},
	{ timeout: 1800000 },
);
