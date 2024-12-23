import { expect, test } from "vitest";

import { createClient, encodePacked, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { waitForTransactionReceipt } from "viem/actions";
import { sepolia } from "viem/chains";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { extractTransactionDepositedLogs } from "../utils/extractTransactionDepositedLogs.js";
import { getL2TransactionHashes } from "../utils/getL2TransactionHashes.js";
import { opaqueDataToDepositData } from "../utils/opaqueDataToDepositData.js";
import { depositERC20 } from "./depositERC20.js";

test(
	"e2e erc20 (sepolia)",
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
			transport: http(),
		});

		const depositAmount = parseEther("0.001");

		const hash = await depositERC20(client_sepolia, {
			request: {
				amount: depositAmount,
				l1Token: "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c",
				l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828",
			},
			targetChain: mantleSepoliaTestnet,
		});

		expect(hash).toBeDefined();

		const receipt = await waitForTransactionReceipt(client_sepolia, {
			hash,
		});

		expect(receipt.status).toEqual("success");

		const [log] = extractTransactionDepositedLogs(receipt);

		const res = opaqueDataToDepositData(log.args.opaqueData);

		expect(res.gas).toBeDefined();
		expect(res.data).toBeDefined();

		expect(log.args.opaqueData).toEqual(
			encodePacked(
				["uint", "uint", "uint", "uint", "uint64", "bool", "bytes"],
				[0n, 0n, 0n, 0n, res.gas, false, res.data],
			),
		);

		const [l2Hash] = getL2TransactionHashes(receipt);

		await waitForTransactionReceipt(client_mantleSepolia, {
			hash: l2Hash,
		});
	},
	{ timeout: 1800000 },
);
