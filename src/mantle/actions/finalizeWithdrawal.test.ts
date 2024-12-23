import { createClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
	getTransactionReceipt,
	mine,
	reset,
	waitForTransactionReceipt,
} from "viem/actions";
import { sepolia } from "viem/chains";
import { beforeEach, expect, test } from "vitest";
import { anvilSepolia } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";
import { mantleSepoliaTestnet } from "../chains/mantleSepoliaTestnet.js";
import { getWithdrawals } from "../utils/getWithdrawals.js";
import { estimateFinalizeWithdrawalGas } from "./estimateFinalizeWithdrawalGas.js";
import { finalizeWithdrawal } from "./finalizeWithdrawal.js";

const sepoliaClient = anvilSepolia.getClient();

const withdrawal = {
	nonce:
		1766847064778384329583297500742918515827483896875618958121606201292655218n,
	sender: "0x4200000000000000000000000000000000000007",
	target: "0x37dAC5312e31Adb8BB0802Fc72Ca84DA5cDfcb4c",
	ethValue: 0n,
	gasLimit: 287624n,
	mntValue: 1000000000000000000n,
	data: "0xff8daf150001000000000000000000000000000000000000000000000000000000008a72000000000000000000000000420000000000000000000000000000000000001000000000000000000000000021f308067241b2028503c07bd7cb3751ffab0fb20000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000a4f407a99e000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a1922000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a19220000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	withdrawalHash:
		"0xa490493880743334cb2a899bc3659363c6263c78fc7f6bf59c2e0e932758b728",
} as const;

beforeEach(async () => {
	await reset(sepoliaClient, {
		blockNumber: 5894862n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
});

test("default", async () => {
	const hash = await finalizeWithdrawal(sepoliaClient, {
		account: accounts[0].address,
		targetChain: mantleSepoliaTestnet,
		withdrawal,
	});
	expect(hash).toBeDefined();

	await mine(sepoliaClient, { blocks: 1 });

	const receipt = await getTransactionReceipt(sepoliaClient, {
		hash,
	});
	expect(receipt.status).toEqual("success");
});

test.skip("e2e", async () => {
	// to be replace
	const l2hash =
		"0xd05ca5a684056d16063818d2fda4d40e04b186c43f5876499e0c197e9e8d985e";

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

	const l2receipt = await getTransactionReceipt(client_mantleSepolia, {
		hash: l2hash,
	});

	const [withdrawal] = getWithdrawals(l2receipt);

	const gas = await estimateFinalizeWithdrawalGas(client_sepolia, {
		targetChain: mantleSepoliaTestnet,
		withdrawal,
		account: account.address,
	});

	const hash = await finalizeWithdrawal(client_sepolia, {
		targetChain: mantleSepoliaTestnet,
		withdrawal,
		gas,
	});

	const receipt = await waitForTransactionReceipt(client_sepolia, {
		hash: hash,
	});

	expect(receipt.status).toEqual("success");
});
