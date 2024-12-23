import { parseEther } from "viem";
import { reset } from "viem/actions";
import { describe, expect, test } from "vitest";
import { anvilMantleSepolia } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";
import { publicActionsL2 } from "./publicL2.js";

const client = anvilMantleSepolia.getClient();
const mantleSepoliaClient = client.extend(publicActionsL2());

test("default", async () => {
	expect(publicActionsL2()(mantleSepoliaClient)).toMatchInlineSnapshot(`
		{
		  "buildProveWithdrawal": [Function],
		  "estimateInitiateERC20Withdrawal": [Function],
		  "estimateInitiateETHWithdrawalGas": [Function],
		  "estimateInitiateMNTWithdrawalGas": [Function],
		}
	`);
});

describe("smoke test", () => {
	test("estimateInitiateMNTWithdrawalGas", async () => {
		const request = await mantleSepoliaClient.estimateInitiateMNTWithdrawalGas({
			account: accounts[0].address,
			request: {
				amount: parseEther("0.001"),
			},
		});
		expect(request).toBeDefined();
	});

	test("buildProveWithdrawal", async () => {
		await reset(mantleSepoliaClient, {
			blockNumber: 11997809n,
			jsonRpcUrl: anvilMantleSepolia.forkUrl,
		});

		const request = await mantleSepoliaClient.buildProveWithdrawal({
			withdrawal: {
				nonce:
					1766847064778384329583297500742918515827483896875618958121606201292655676n,
				sender: "0x4200000000000000000000000000000000000007",
				target: "0x37dAC5312e31Adb8BB0802Fc72Ca84DA5cDfcb4c",
				mntValue: 100000000000000000n,
				ethValue: 0n,
				gasLimit: 287624n,
				data: "0xff8daf150001000000000000000000000000000000000000000000000000000000008c3c000000000000000000000000420000000000000000000000000000000000001000000000000000000000000021f308067241b2028503c07bd7cb3751ffab0fb2000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000a4f407a99e000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a1922000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a1922000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
				withdrawalHash:
					"0x1086b9b7769971e13c0f7b1bfd9dba9825b34dafd44e4256e12d93b54107a675",
			},
			output: {
				outputIndex: 25937n,
				outputRoot:
					"0x856aa2cbc2c5d40f5c76a8340c10e2cf0e8a3c47102a1800d6580ad3ffe66370",
				timestamp: 1725542424n,
				l2BlockNumber: 11997809n,
			},
		});
		expect(request).toBeDefined();
	});
});
