import { expect, test } from "vitest";
import { mainnetClient } from "~test/src/utils.js";
import { mantle } from "../chains/index.js";
import { getL2Output } from "./getL2Output.js";

test("default", async () => {
	const output = await getL2Output(mainnetClient, {
		l2BlockNumber: 64151580n,
		targetChain: mantle,
	});
	expect(output).toMatchInlineSnapshot(`
		{
		  "l2BlockNumber": 64152746n,
		  "outputIndex": 1655n,
		  "outputRoot": "0x59cd645389738f0e1b531ee6dbe739125526c5518774bbfe5f775f23e00e3c38",
		  "timestamp": 1716437531n,
		}
	`);
});
