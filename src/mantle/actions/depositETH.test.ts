import { beforeAll, expect, test } from "vitest";

import { encodePacked, parseEther } from "viem";
import {
	mine,
	reset,
	setBalance,
	waitForTransactionReceipt,
} from "viem/actions";
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
