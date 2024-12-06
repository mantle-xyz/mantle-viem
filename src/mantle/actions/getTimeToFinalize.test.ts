import { getTransactionReceipt, reset } from "viem/actions";
import { expect, test, vi } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";

import { getWithdrawals } from "../utils/getWithdrawals.js";
import { getTimeToFinalize } from "./getTimeToFinalize.js";

const sepoliaClient = anvilSepolia.getClient();
const mantleSepoliaClient = anvilMantleSepolia.getClient();

test("default", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6640685n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997559n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0xe62a64c326be73305c87bb50c5685bfd0b0b7dbf092a1e9c35ccba4cca155bf3",
	});

	const [withdrawal] = getWithdrawals(receipt);

	vi.setSystemTime(new Date(1711008145099));

	const time = await getTimeToFinalize(sepoliaClient, {
		...withdrawal!,
		targetChain: mantleSepoliaClient.chain,
	});

	vi.useRealTimers();

	expect(time).toMatchInlineSnapshot(`
		{
		  "period": 300,
		  "seconds": 14581604,
		  "timestamp": 1725589749099,
		}
	`);
});

test("ready to finalize", async () => {
	await reset(sepoliaClient, {
		blockNumber: 6640685n,
		jsonRpcUrl: anvilSepolia.forkUrl,
	});
	await reset(mantleSepoliaClient, {
		blockNumber: 11997559n,
		jsonRpcUrl: anvilMantleSepolia.forkUrl,
	});

	const receipt = await getTransactionReceipt(mantleSepoliaClient, {
		hash: "0xe62a64c326be73305c87bb50c5685bfd0b0b7dbf092a1e9c35ccba4cca155bf3",
	});

	const [withdrawal] = getWithdrawals(receipt);

	vi.setSystemTime(new Date(1725589749099));

	const time = await getTimeToFinalize(sepoliaClient, {
		...withdrawal!,
		targetChain: mantleSepoliaClient.chain,
	});

	vi.useRealTimers();

	expect(time).toMatchInlineSnapshot(`
		{
		  "period": 300,
		  "seconds": 0,
		  "timestamp": 1725589749099,
		}
	`);
});
