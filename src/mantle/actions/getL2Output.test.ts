import { expect, test } from "vitest";
import { mainnetClient } from "~test/src/utils.js";
import { mantle } from "../chains/index.js";
import { LatestL2OutputNotReadyError } from "../errors/withdrawal.js";
import { getL2Output } from "./getL2Output.js";

test("strategy: earliest", async () => {
	const output = await getL2Output(mainnetClient, {
		l2BlockNumber: 64151580n,
		strategy: "earliest",
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

test("default (latest) covers the withdrawal block", async () => {
	const output = await getL2Output(mainnetClient, {
		l2BlockNumber: 64151580n,
		targetChain: mantle,
	});
	// The latest output must cover the withdrawal block, and (being the latest)
	// be at least as recent as the earliest covering output.
	expect(output.l2BlockNumber > 64151580n).toBe(true);
	expect(output.outputIndex >= 1655n).toBe(true);
	expect(output.outputRoot).toMatch(/^0x[0-9a-f]{64}$/);
});

test("default (latest) accepts a block equal to the latest output block", async () => {
	const latestOutput = await getL2Output(mainnetClient, {
		l2BlockNumber: 64151580n,
		targetChain: mantle,
	});

	const output = await getL2Output(mainnetClient, {
		l2BlockNumber: latestOutput.l2BlockNumber,
		targetChain: mantle,
	});

	expect(output.l2BlockNumber >= latestOutput.l2BlockNumber).toBe(true);
	expect(output.outputRoot).toMatch(/^0x[0-9a-f]{64}$/);
});

test("default (latest) throws when no output covers the block yet", async () => {
	// A block far in the future is never covered by the latest committed output.
	await expect(
		getL2Output(mainnetClient, {
			l2BlockNumber: 999_999_999_999n,
			targetChain: mantle,
		}),
	).rejects.toThrowError(LatestL2OutputNotReadyError);
});
