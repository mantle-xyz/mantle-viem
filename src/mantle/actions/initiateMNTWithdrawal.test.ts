import { createClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
	getTransactionReceipt,
	mine,
	waitForTransactionReceipt,
} from "viem/actions";
import { sepolia } from "viem/chains";
import { describe, expect, test } from "vitest";
import { anvilMantleSepolia } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { extractWithdrawalMessageLogs } from "../utils/extractWithdrawalMessageLogs.js";
import { getTimeToProve } from "./getTimeToProve.js";
import { initiateMNTWithdrawal } from "./initiateMNTWithdrawal.js";
import { waitToProve } from "./waitToProve.js";

const mantleSepoliaClient = anvilMantleSepolia.getClient();

test("default", async () => {
	const hash = await initiateMNTWithdrawal(mantleSepoliaClient, {
		account: accounts[0].address,
		request: {
			amount: parseEther("1"),
		},
	});
	expect(hash).toBeDefined();

	await mine(mantleSepoliaClient, { blocks: 1 });

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash,
	});
	expect(receipt).toBeDefined();

	const [log] = extractWithdrawalMessageLogs(receipt);

	const {
		args: { nonce: _, withdrawalHash: __, ...args },
	} = log;
	expect(args).toMatchInlineSnapshot(`
		{
		  "data": "0xff8daf150001000000000000000000000000000000000000000000000000000000008b94000000000000000000000000420000000000000000000000000000000000001000000000000000000000000021f308067241b2028503c07bd7cb3751ffab0fb20000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000a4f407a99e000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
		  "ethValue": 0n,
		  "gasLimit": 287624n,
		  "mntValue": 1000000000000000000n,
		  "sender": "0x4200000000000000000000000000000000000007",
		  "target": "0x37dAC5312e31Adb8BB0802Fc72Ca84DA5cDfcb4c",
		}
	`);
});

describe.skip("e2e", () => {
	const account = privateKeyToAccount(
		(process.env.VITE_ACCOUNT_PRIVATE_KEY as `0x${string}`) ||
			accounts[0].privateKey,
	);

	const client_mantleSepolia = createClient({
		account,
		chain: mantleSepoliaTestnet,
		transport: http(),
	});
	const client_sepolia = createClient({
		account,
		chain: sepolia,
		transport: http(),
	});

	test("full", async () => {
		const hash = await initiateMNTWithdrawal(client_mantleSepolia, {
			request: {
				amount: parseEther("0.001"),
			},
		});

		const receipt = await waitForTransactionReceipt(client_mantleSepolia, {
			hash: hash,
		});

		const proveTime = await getTimeToProve(client_sepolia, {
			receipt: receipt,
			targetChain: client_mantleSepolia.chain,
		});

		// biome-ignore lint/suspicious/noConsoleLog:
		console.log("seconds to prove:", proveTime.seconds);

		// const { withdrawal, output } = await waitToProve(client_sepolia, {
		// 	receipt: receipt,
		// 	targetChain: client_mantleSepolia.chain,
		// });

		// const proveArgs = await buildProveWithdrawal(client_opSepolia, {
		// 	output,
		// 	withdrawal,
		// });

		// const proveHash = await proveWithdrawal(client_sepolia, proveArgs);

		// await waitForTransactionReceipt(client_sepolia, {
		// 	hash: proveHash,
		// });

		// const finalizeTime = await getTimeToFinalize(client_sepolia, {
		// 	targetChain: client_opSepolia.chain,
		// 	withdrawalHash: withdrawal.withdrawalHash,
		// });

		// biome-ignore lint/suspicious/noConsoleLog:
		// console.log("seconds to finalize:", finalizeTime.seconds);

		// await waitToFinalize(client_sepolia, {
		// 	targetChain: client_opSepolia.chain,
		// 	withdrawalHash: withdrawal.withdrawalHash,
		// });

		// const finalizeHash = await finalizeWithdrawal(client_sepolia, {
		// 	targetChain: client_opSepolia.chain,
		// 	withdrawal,
		// });

		// await waitForTransactionReceipt(client_sepolia, {
		// 	hash: finalizeHash,
		// });
	}, 1200000);
});
