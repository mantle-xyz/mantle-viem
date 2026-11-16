import { describe, expect, test } from "vitest";
import {
	controlSource,
	evaluateControl,
	evaluateTypeCheck,
	parseDiagnostics,
} from "./check-package.mjs";

const viemError =
	"node_modules/webauthn-p256/_types/types.d.ts(27,67): error TS2536: Type '_K' cannot be used to index type 'fallback'.";
const packageError =
	"node_modules/@mantleio/viem/dist/types-cjs/errors/withdrawal.d.ts(1,34): error TS2856: Import attributes are not allowed on statements that compile to CommonJS 'require' calls.";
const consumerError =
	"consumer-node16-cjs.cts(2,1): error TS2307: Cannot find module '@mantleio/viem/actions' or its corresponding type declarations.";

const cleanControl = evaluateControl({ status: 0, stdout: "", stderr: "" });
const controlWith = (...lines: string[]) =>
	evaluateControl({ status: 2, stdout: `${lines.join("\n")}\n`, stderr: "" });

describe("evaluateTypeCheck: the compiler run itself", () => {
	test("passes a clean run", () => {
		const result = evaluateTypeCheck(
			{ status: 0, stdout: "", stderr: "" },
			cleanControl,
		);
		expect(result.ok).toBe(true);
	});

	test("fails when the compiler path does not exist (node exits 1, no diagnostics)", () => {
		const result = evaluateTypeCheck(
			{
				status: 1,
				stdout: "",
				stderr: "Error: Cannot find module '/does/not/exist/tsc'\n",
			},
			cleanControl,
		);
		expect(result.ok).toBe(false);
		expect(result.problems[0]).toContain("status 1 without diagnostics");
	});

	test("fails on a diagnostic without a file location (TS5023, exit 2), even if the control reports it too", () => {
		const line = "error TS5023: Unknown compiler option 'bogus'.";
		const result = evaluateTypeCheck(
			{ status: 2, stdout: `${line}\n`, stderr: "" },
			controlWith(line),
		);
		expect(result.ok).toBe(false);
		expect(result.packageErrors).toEqual([line]);
	});

	test("fails when the compiler cannot start", () => {
		const result = evaluateTypeCheck(
			{ error: new Error("spawnSync node ENOENT"), status: null },
			cleanControl,
		);
		expect(result.ok).toBe(false);
		expect(result.problems[0]).toContain("did not start");
	});

	test("fails when the compiler is killed", () => {
		const result = evaluateTypeCheck(
			{ signal: "SIGKILL", status: null, stdout: "" },
			cleanControl,
		);
		expect(result.ok).toBe(false);
	});

	test("fails when diagnostics come with exit status 0", () => {
		const result = evaluateTypeCheck(
			{ status: 0, stdout: `${viemError}\n` },
			controlWith(viemError),
		);
		expect(result.ok).toBe(false);
	});

	test("fails when the control project itself did not run", () => {
		const control = evaluateControl({
			status: 1,
			stdout: "",
			stderr: "boom\n",
		});
		const result = evaluateTypeCheck({ status: 0, stdout: "" }, control);
		expect(result.ok).toBe(false);
		expect(result.problems[0]).toContain("control:");
	});
});

describe("evaluateTypeCheck: diagnostic attribution", () => {
	test("exempts a dependency diagnostic the viem-only control also reports", () => {
		const result = evaluateTypeCheck(
			{ status: 2, stdout: `${viemError}\n` },
			controlWith(viemError),
		);
		expect(result).toMatchObject({
			ok: true,
			upstreamErrors: [viemError],
			packageErrors: [],
		});
	});

	test("fails on a dependency diagnostic the control does not report", () => {
		const result = evaluateTypeCheck(
			{ status: 2, stdout: `${viemError}\n` },
			cleanControl,
		);
		expect(result.ok).toBe(false);
		expect(result.packageErrors).toEqual([viemError]);
	});

	test("never exempts diagnostics in this package or the consumer file", () => {
		const result = evaluateTypeCheck(
			{ status: 2, stdout: `${packageError}\n${consumerError}\n` },
			controlWith(packageError, consumerError),
		);
		expect(result.ok).toBe(false);
		expect(result.packageErrors).toEqual([packageError, consumerError]);
	});
});

test("parseDiagnostics keeps only the first line of each diagnostic", () => {
	expect(
		parseDiagnostics(
			`${viemError}\n  continuation of the message\nerror TS5023: Unknown compiler option 'x'.\n`,
		).map((d) => d.file),
	).toEqual(["node_modules/webauthn-p256/_types/types.d.ts", undefined]);
});

test("controlSource imports viem types with resolution-mode only for CommonJS files", () => {
	expect(controlSource(true)).toContain('"resolution-mode": "import"');
	expect(controlSource(false)).not.toContain("resolution-mode");
});
