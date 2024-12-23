import { describe, expect, test } from "vitest";

import { anvilMainnet } from "~test/src/anvil.js";
import { accounts } from "~test/src/constants.js";
import { walletActionsL2 } from "./walletL2.js";

const client = anvilMainnet.getClient();
const l2Client = client.extend(walletActionsL2());

test("default", async () => {
	expect(walletActionsL2()(client)).toMatchInlineSnapshot(`
		{
		  "initiateERC20Withdrawal": [Function],
		  "initiateETHWithdrawal": [Function],
		  "initiateMNTWithdrawal": [Function],
		}
	`);
});

describe("smoke test", () => {
	test("initiateMNTWithdrawal", async () => {
		const hash = await l2Client.initiateMNTWithdrawal({
			account: accounts[0].address,
			request: {
				amount: 1n,
			},
		});
		expect(hash).toBeDefined();
	});
});
