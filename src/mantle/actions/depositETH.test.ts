import { beforeAll, expect, test } from "vitest";

import { createClient, encodePacked, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
	mine,
	reset,
	setBalance,
	waitForTransactionReceipt,
} from "viem/actions";
import { sepolia } from "viem/chains";
import { anvilSepolia } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { extractTransactionDepositedLogs } from "../utils/extractTransactionDepositedLogs.js";
import { getL2TransactionHashes } from "../utils/getL2TransactionHashes.js";
import { opaqueDataToDepositData } from "../utils/opaqueDataToDepositData.js";
import { depositETH } from "./depositETH.js";

const sepoliaClient = anvilSepolia.getClient();

beforeAll(async () => {
	await reset(sepoliaClient, {
		blockNumber: 6632531n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await setBalance(sepoliaClient, {
		address: accounts[0].address,
		value: parseEther("10000"),
	});
});

test(
	"eth (sepolia)",
	async () => {
		const depositAmount = parseEther("0.001");

		const hash = await depositETH(sepoliaClient, {
			account: accounts[0].address,
			request: {
				amount: depositAmount,
			},
			targetChain: mantleSepoliaTestnet,
		});

		expect(hash).toBeDefined();

		await mine(sepoliaClient, { blocks: 1 });

		const receipt = await waitForTransactionReceipt(sepoliaClient, {
			hash,
		});

		const [log] = extractTransactionDepositedLogs(receipt);

		const res = opaqueDataToDepositData(log.args.opaqueData);

		expect(res.gas).toBeDefined();
		expect(res.data).toBeDefined();

		expect(log.args.opaqueData).toEqual(
			encodePacked(
				["uint", "uint", "uint", "uint", "uint64", "bool", "bytes"],
				[0n, 0n, depositAmount, depositAmount, res.gas, false, res.data],
			),
		);

		const [l2Hash] = getL2TransactionHashes(receipt);

		expect(l2Hash).toBeDefined();
	},
	{ timeout: 1800000 },
);

test.skip(
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
			transport: http(),
		});

		const hash = await depositETH(client_sepolia, {
			request: {
				amount: parseEther("0.001"),
			},
			targetChain: mantleSepoliaTestnet,
		});

		expect(hash).toBeDefined();

		const receipt = await waitForTransactionReceipt(client_sepolia, {
			hash,
		});

		expect(receipt.status).toEqual("success");

		const [l2Hash] = getL2TransactionHashes(receipt);

		await waitForTransactionReceipt(client_mantleSepolia, {
			hash: l2Hash,
		});
	},
	{ timeout: 1800000 },
);
