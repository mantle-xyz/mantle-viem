import { afterEach, describe, expect, test, vi } from "vitest";
import {
	createFakeL1Client,
	type FakeL1,
	oracleAddress,
	receiptAt,
} from "~test/src/fakeL1.js";
import { LatestL2OutputNotReadyError } from "../errors/withdrawal.js";
import { getL2Output } from "./getL2Output.js";
import { getTimeToNextL2Output } from "./getTimeToNextL2Output.js";
import { getTimeToProve } from "./getTimeToProve.js";

// L: latest output block; S: SUBMISSION_INTERVAL; T: interval with buffer
// (same expression as the implementation, so Math.ceil(3600 * 1.1) === 3961);
// R: estimated seconds until the next output.
const L = 1_000_000n;
const S = 1800n;
const BLOCK_TIME = 2n;
const OUTPUT_TS = 1_700_000_000n;
const ELAPSED = 1653;
const T = Math.ceil(Number(S * BLOCK_TIME) * 1.1);
const R = T - (ELAPSED % T);

const state: FakeL1 = {
	outputs: [
		{ l2BlockNumber: L - 2n * S, timestamp: OUTPUT_TS - 7200n },
		{ l2BlockNumber: L - S, timestamp: OUTPUT_TS - 3600n },
		{ l2BlockNumber: L, timestamp: OUTPUT_TS },
	],
	submissionInterval: S,
	l2BlockTime: BLOCK_TIME,
};

function setNow(elapsedSeconds: number) {
	vi.useFakeTimers({ toFake: ["Date"] });
	vi.setSystemTime(Number(OUTPUT_TS) * 1000 + elapsedSeconds * 1000);
}

afterEach(() => {
	vi.useRealTimers();
});

describe("getTimeToNextL2Output: block boundaries (now >= latest output timestamp)", () => {
	test.each([
		["L - 1", L - 1n, 0],
		["L (equals latest output block)", L, 0],
		["L + 1", L + 1n, R],
		["L + S - 1", L + S - 1n, R],
		["L + S (next output block)", L + S, R],
		["L + S + 1", L + S + 1n, T + R],
		["L + 2S", L + 2n * S, T + R],
		["L + 2S + 1", L + 2n * S + 1n, 2 * T + R],
	])("%s", async (_, l2BlockNumber, expected) => {
		setNow(ELAPSED);
		const { client } = createFakeL1Client(state);
		const { interval, seconds, timestamp } = await getTimeToNextL2Output(
			client,
			{ l2BlockNumber, l2OutputOracleAddress: oracleAddress },
		);
		expect(interval).toBe(3600);
		expect(seconds).toBe(expected);
		expect(timestamp).toBe(
			expected > 0 ? Date.now() + expected * 1000 : undefined,
		);
	});
});

describe("getTimeToNextL2Output: elapsed time keeps the existing modulo rule", () => {
	test.each([
		[0, T],
		[T - 1, 1],
		[T, T],
		[T + 1, T - 1],
	])("elapsed %i s -> %i s", async (elapsed, expected) => {
		setNow(elapsed);
		const { client } = createFakeL1Client(state);
		const { seconds } = await getTimeToNextL2Output(client, {
			l2BlockNumber: L + 1n,
			l2OutputOracleAddress: oracleAddress,
		});
		expect(seconds).toBe(expected);
	});

	test("custom intervalBuffer", async () => {
		setNow(ELAPSED);
		const { client } = createFakeL1Client(state);
		const T15 = Math.ceil(Number(S * BLOCK_TIME) * 1.5);
		const R15 = T15 - (ELAPSED % T15);
		const at = (l2BlockNumber: bigint) =>
			getTimeToNextL2Output(client, {
				intervalBuffer: 1.5,
				l2BlockNumber,
				l2OutputOracleAddress: oracleAddress,
			}).then((r) => r.seconds);
		expect(await at(L)).toBe(0);
		expect(await at(L + S)).toBe(R15);
		expect(await at(L + S + 1n)).toBe(T15 + R15);
	});

	test("local clock behind the latest output timestamp still returns 0", async () => {
		setNow(-30);
		const { client } = createFakeL1Client(state);
		const { seconds, timestamp } = await getTimeToNextL2Output(client, {
			l2BlockNumber: L + 1n,
			l2OutputOracleAddress: oracleAddress,
		});
		expect(seconds).toBe(0);
		expect(timestamp).toBe(undefined);
	});
});

describe("getTimeToNextL2Output agrees with getL2Output (latest strategy)", () => {
	test.each([L - 1n, L, L + 1n])("block %s", async (l2BlockNumber) => {
		setNow(ELAPSED);
		const { client } = createFakeL1Client(state);
		const { seconds } = await getTimeToNextL2Output(client, {
			l2BlockNumber,
			l2OutputOracleAddress: oracleAddress,
		});
		const covered = await getL2Output(client, {
			l2BlockNumber,
			l2OutputOracleAddress: oracleAddress,
		}).then(
			() => true,
			(error) => {
				expect(error).toBeInstanceOf(LatestL2OutputNotReadyError);
				return false;
			},
		);
		expect(seconds === 0).toBe(covered);
	});
});

describe("getTimeToProve", () => {
	test("receipt block equal to the latest output block is ready (0 s)", async () => {
		setNow(ELAPSED);
		const { client } = createFakeL1Client(state);
		const { seconds, timestamp } = await getTimeToProve(client, {
			receipt: receiptAt(L),
			l2OutputOracleAddress: oracleAddress,
		});
		expect(seconds).toBe(0);
		expect(timestamp).toBe(undefined);
	});

	test("receipt block one past the latest output block waits R s", async () => {
		setNow(ELAPSED);
		const { client } = createFakeL1Client(state);
		const { seconds } = await getTimeToProve(client, {
			receipt: receiptAt(L + 1n),
			l2OutputOracleAddress: oracleAddress,
		});
		expect(seconds).toBe(R);
	});
});
