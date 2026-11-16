import { describe, expect, test } from "vitest";
import { createFakeL1Client, type FakeL1 } from "~test/src/fakeL1.js";
import { getPortalVersion } from "./getPortalVersion.js";

// Each test uses its own portal address so the module-level cache never leaks
// between tests.
const base: Omit<FakeL1, "portalVersions"> = {
	outputs: [],
	submissionInterval: 1n,
	l2BlockTime: 1n,
};

function portal(n: number) {
	return `0x00000000000000000000000000000000000b${n.toString().padStart(4, "0")}` as const;
}

describe("getPortalVersion cache", () => {
	test("two clients, same portal address, concurrent calls: no shared version", async () => {
		const portalAddress = portal(1);
		const a = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "1.7.0" },
		});
		const b = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "3.10.0" },
		});
		const [va, vb] = await Promise.all([
			getPortalVersion(a.client, { portalAddress }),
			getPortalVersion(b.client, { portalAddress }),
		]);
		expect(va).toEqual({ major: 1, minor: 7, patch: 0 });
		expect(vb).toEqual({ major: 3, minor: 10, patch: 0 });
		expect(a.calls).toHaveLength(1);
		expect(b.calls).toHaveLength(1);
	});

	test("two clients, same portal address, sequential calls within the cache time", async () => {
		const portalAddress = portal(2);
		const a = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "1.7.0" },
		});
		const b = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "3.10.0" },
		});
		await getPortalVersion(a.client, { portalAddress });
		const vb = await getPortalVersion(b.client, { portalAddress });
		expect(vb).toEqual({ major: 3, minor: 10, patch: 0 });
		expect(b.calls).toHaveLength(1);
	});

	test("one client's RPC error is not shared with another client", async () => {
		const portalAddress = portal(3);
		const a = createFakeL1Client({
			...base,
			portalError: new Error("rpc down"),
		});
		const b = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "1.7.0" },
		});
		const [ra, rb] = await Promise.allSettled([
			getPortalVersion(a.client, { portalAddress }),
			getPortalVersion(b.client, { portalAddress }),
		]);
		expect(ra.status).toBe("rejected");
		expect(rb).toEqual({
			status: "fulfilled",
			value: { major: 1, minor: 7, patch: 0 },
		});
	});

	test("the same client is still cached, including through extend()", async () => {
		const portalAddress = portal(4);
		const a = createFakeL1Client({
			...base,
			portalVersions: { [portalAddress]: "1.7.0" },
		});
		const extended = a.client.extend(() => ({}));
		expect(extended.uid).toBe(a.client.uid);
		await getPortalVersion(a.client, { portalAddress });
		await getPortalVersion(extended, { portalAddress });
		expect(a.calls).toHaveLength(1);
	});
});
