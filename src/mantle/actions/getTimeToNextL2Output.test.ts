import { beforeAll, expect, test, vi } from "vitest";
import { anvilMainnet } from "~test/src/anvil.js";

import { reset } from "viem/actions";
import { mantle } from "../chains/index.js";
import { getTimeToNextL2Output } from "./getTimeToNextL2Output.js";

const client = anvilMainnet.getClient();

beforeAll(async () => {
	await reset(client, {
		blockNumber: 20683814n,
		jsonRpcUrl: anvilMainnet.forkUrl,
	});
});

test("default", async () => {
	const { interval, seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 113405763n,
		targetChain: mantle,
	});
	expect(interval).toBe(3600);
	expect(seconds).toBeDefined();
	expect(timestamp).toBeDefined();
});

test("Date.now < latestOutputTimestamp", async () => {
	vi.setSystemTime(new Date(1702399191000));
	const { seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 113405763n,
		targetChain: mantle,
	});
	vi.useRealTimers();
	expect(seconds).toBe(0);
	expect(timestamp).toBe(undefined);
});

test("elapsedBlocks > blockInterval (w/ l2BlockNumber)", async () => {
	vi.setSystemTime(new Date(1725532700000));
	const { seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 68699549n,
		targetChain: mantle,
	});
	vi.useRealTimers();
	expect(seconds).toBe(2308);
	expect(timestamp).toBe(1725535008000);
});

test("l2BlockNumber < latestOutput.blockNumber (no l2BlockNumber)", async () => {
	vi.setSystemTime(new Date(1702412427000));
	const { seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 113400763n,
		targetChain: mantle,
	});
	vi.useRealTimers();
	expect(seconds).toBe(0);
	expect(timestamp).toBe(undefined);
});

test("args: chain", async () => {
	const { seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 113405763n,
		chain: null,
		targetChain: mantle,
	});
	expect(seconds).toBeDefined();
	expect(timestamp).toBeDefined();
});

test("args: l2OutputOracleAddress", async () => {
	const { seconds, timestamp } = await getTimeToNextL2Output(client, {
		l2BlockNumber: 113405763n,
		l2OutputOracleAddress: "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481",
	});
	expect(seconds).toBeDefined();
	expect(timestamp).toBeDefined();
});
