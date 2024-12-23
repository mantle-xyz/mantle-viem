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
import { estimateInitiateETHWithdrawalGas } from "./estimateInitiateETHWithdrawalGas.js";
import { getTimeToProve } from "./getTimeToProve.js";
import { initiateETHWithdrawal } from "./initiateETHWithdrawal.js";
import { waitToProve } from "./waitToProve.js";

describe("e2e", () => {
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
		const gas = await estimateInitiateETHWithdrawalGas(client_mantleSepolia, {
			request: {
				amount: parseEther("0.001"),
			},
			account: account.address,
		});

		const hash = await initiateETHWithdrawal(client_mantleSepolia, {
			request: {
				amount: parseEther("0.001"),
			},
			gas,
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
