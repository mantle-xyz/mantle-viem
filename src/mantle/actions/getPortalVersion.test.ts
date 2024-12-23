import { beforeAll, expect, test } from "vitest";
import { anvilMantleSepolia, anvilSepolia } from "~test/src/anvil.js";
import { mainnetClient } from "~test/src/utils.js";
import { mantle, mantleSepoliaTestnet } from "../chains/index.js";
import { getPortalVersion } from "./getPortalVersion.js";

const sepoliaClient = anvilSepolia.getClient();

beforeAll(async () => {
	await anvilSepolia.restart();
	await anvilMantleSepolia.restart();
});

test("default", async () => {
	const version = await getPortalVersion(mainnetClient, {
		targetChain: mantle,
	});
	expect(version).toBeDefined();
});

test("sepolia", async () => {
	const version = await getPortalVersion(sepoliaClient, {
		targetChain: mantleSepoliaTestnet,
	});
	expect(version).toBeDefined();
});

test("args: portalAddress", async () => {
	const version = await getPortalVersion(sepoliaClient, {
		portalAddress: "0xB3db4bd5bc225930eD674494F9A4F6a11B8EFBc8",
	});
	expect(version).toBeDefined();
});
