// Checks the packed package the way a consumer installs it (run after `pnpm build`).
//
// For each viem installation given, it creates an isolated consumer project,
// extracts the packed tarball into node_modules/@mantleio/viem and checks:
//   - runtime: ESM import and CJS require of every package entry point;
//   - types: strict consumers (`skipLibCheck: false`) in node16/nodenext CJS and
//     ESM, bundler and node10 module resolution.
//
// A type check passes only when the compiler ran normally and every diagnostic
// is a known upstream one: located in a dependency's declarations (not in this
// package or the consumer file) and reported identically by a viem-only control
// project compiled in the same consumer with the same options. Compiler start
// failures, signals, non-zero exits without diagnostics and diagnostics without
// a file location (e.g. TS5023) all fail the check.
//
// Usage:
//   node ./scripts/check-package.mjs [--package <tgz>] [--viem <viem package dir>]... [--typescript <tsc.js>]
// Defaults: packs the working tree; checks against ./node_modules/viem.

import { execFileSync, spawnSync } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	realpathSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const diagnosticPattern = /^(?:(.+?)\(\d+,\d+\): )?error TS\d+: /;

/**
 * Parses `tsc --pretty false` output into the first line of each diagnostic.
 * @param {string} output
 * @returns {{ line: string, file: string | undefined }[]}
 */
export function parseDiagnostics(output) {
	return output
		.split("\n")
		.map((line) => line.trimEnd())
		.filter((line) => diagnosticPattern.test(line))
		.map((line) => ({ line, file: diagnosticPattern.exec(line)?.[1] }));
}

/**
 * True for declaration files of dependencies other than this package.
 * @param {string | undefined} file
 */
function isDependencyFile(file) {
	return Boolean(
		file?.includes("node_modules/") &&
			!file.includes("node_modules/@mantleio/viem/"),
	);
}

/** @param {string | undefined} text */
const firstLine = (text) => (text ?? "").trim().split("\n")[0] || "(no output)";

/**
 * Problems that mean the compiler run itself cannot be trusted.
 * @param {{ error?: Error, signal?: string | null, status: number | null, stdout?: string, stderr?: string }} run
 * @param {number} diagnosticCount
 */
function processProblems(run, diagnosticCount) {
	if (run.error) return [`compiler did not start: ${run.error.message}`];
	if (run.signal) return [`compiler was killed by ${run.signal}`];
	if (run.status !== 0 && diagnosticCount === 0)
		return [
			`compiler exited with status ${run.status} without diagnostics: ${firstLine(run.stderr || run.stdout)}`,
		];
	if (run.status === 0 && diagnosticCount > 0)
		return ["compiler reported diagnostics but exited with status 0"];
	return [];
}

/**
 * Collects the diagnostics of the viem-only control project.
 * @param {Parameters<typeof processProblems>[0]} run
 */
export function evaluateControl(run) {
	const diagnostics = parseDiagnostics(run.stdout ?? "");
	return {
		problems: processProblems(run, diagnostics.length).map(
			(p) => `control: ${p}`,
		),
		known: new Set(diagnostics.map((d) => d.line)),
	};
}

/**
 * Decides whether a consumer type check passes.
 * @param {Parameters<typeof processProblems>[0]} run
 * @param {{ problems: string[], known: Set<string> }} control
 */
export function evaluateTypeCheck(run, control) {
	const diagnostics = parseDiagnostics(run.stdout ?? "");
	const problems = [
		...control.problems,
		...processProblems(run, diagnostics.length),
	];
	/** @type {string[]} */
	const packageErrors = [];
	/** @type {string[]} */
	const upstreamErrors = [];
	for (const { line, file } of diagnostics) {
		if (isDependencyFile(file) && control.known.has(line))
			upstreamErrors.push(line);
		else packageErrors.push(line);
	}
	return {
		ok: problems.length === 0 && packageErrors.length === 0,
		problems,
		packageErrors,
		upstreamErrors,
	};
}

/** @param {boolean} cjs */
export function controlSource(cjs) {
	const attributes = cjs ? ' with { "resolution-mode": "import" }' : "";
	return `import type { Chain } from "viem"${attributes};
import type { ReadContractErrorType } from "viem/actions"${attributes};
import type { FormattedTransactionRequest } from "viem/utils"${attributes};
export type Used = [Chain, ReadContractErrorType, FormattedTransactionRequest];
`;
}

const consumerSource = `
import { getTimeToProve, LatestL2OutputNotReadyError, publicActionsL2 } from "@mantleio/viem";
import { getTimeToNextL2Output } from "@mantleio/viem/actions";
import { mantle } from "@mantleio/viem/chains";
import { getWithdrawals } from "@mantleio/viem/utils";

const id: 5000 = mantle.id;
const error = new LatestL2OutputNotReadyError({ l2BlockNumber: 1n, latestL2BlockNumber: 0n });
const message: string = error.shortMessage;
type Seconds = Awaited<ReturnType<typeof getTimeToNextL2Output>>["seconds"];
const seconds: Seconds = 0;
export const used = [id, message, seconds, getTimeToProve, publicActionsL2, getWithdrawals];
`;

const entries = {
	"@mantleio/viem": "publicActionsL2",
	"@mantleio/viem/actions": "getTimeToNextL2Output",
	"@mantleio/viem/chains": "mantle",
	"@mantleio/viem/utils": "getWithdrawals",
};

const modes = [
	["node16-cjs", "node16", "node16", "cts"],
	["node16-esm", "node16", "node16", "mts"],
	["nodenext-cjs", "nodenext", "nodenext", "cts"],
	["nodenext-esm", "nodenext", "nodenext", "mts"],
	["bundler", "esnext", "bundler", "ts"],
	["node10", "commonjs", "node10", "ts"],
];

/**
 * @param {string} cwd
 * @param {string} tsc
 * @param {string} config
 */
const runTsc = (cwd, tsc, config) =>
	spawnSync("node", [tsc, "-p", config, "--pretty", "false"], {
		cwd,
		encoding: "utf8",
	});

function main() {
	const root = fileURLToPath(new URL("..", import.meta.url));
	const { values } = parseArgs({
		options: {
			package: { type: "string" },
			viem: { type: "string", multiple: true },
			typescript: { type: "string" },
		},
	});
	const tsc = resolve(
		values.typescript ?? join(root, "node_modules/typescript/bin/tsc"),
	);
	const viemDirs = (values.viem ?? [join(root, "node_modules/viem")]).map((d) =>
		realpathSync(resolve(d)),
	);

	const work = mkdtempSync(join(tmpdir(), "mantle-viem-package-"));
	const tarball = values.package
		? resolve(values.package)
		: join(
				work,
				execFileSync(
					"npm",
					["pack", "--ignore-scripts", "--silent", "--pack-destination", work],
					{ cwd: root, encoding: "utf8" },
				)
					.trim()
					.split("\n")
					.pop(),
			);

	let failed = false;
	for (const viemDir of viemDirs) {
		const { version } = JSON.parse(
			readFileSync(join(viemDir, "package.json"), "utf8"),
		);
		const consumer = join(work, `consumer-viem-${version}`);
		const pkgDir = join(consumer, "node_modules/@mantleio/viem");
		mkdirSync(pkgDir, { recursive: true });
		execFileSync("tar", [
			"-xzf",
			tarball,
			"-C",
			pkgDir,
			"--strip-components=1",
		]);
		symlinkSync(viemDir, join(consumer, "node_modules/viem"), "dir");
		writeFileSync(
			join(consumer, "package.json"),
			'{ "name": "consumer", "private": true }\n',
		);
		console.log(`\n# viem ${version} (${tarball})`);

		// Runtime.
		for (const [spec, symbol] of Object.entries(entries)) {
			for (const [kind, code] of [
				[
					"esm",
					`import(${JSON.stringify(spec)}).then((m) => { if (!m[${JSON.stringify(symbol)}]) process.exit(3) })`,
				],
				[
					"cjs",
					`if (!require(${JSON.stringify(spec)})[${JSON.stringify(symbol)}]) process.exit(3)`,
				],
			]) {
				const args =
					kind === "esm" ? ["--input-type=module", "-e", code] : ["-e", code];
				const run = spawnSync("node", args, {
					cwd: consumer,
					encoding: "utf8",
				});
				const ok = !run.error && !run.signal && run.status === 0;
				failed ||= !ok;
				console.log(
					`runtime ${kind} ${spec}: ${ok ? "ok" : `FAIL ${firstLine(run.stderr) || run.error?.message}`}`,
				);
			}
		}

		// Types.
		for (const [name, module, moduleResolution, ext] of modes) {
			/** @param {string} kind @param {string} source */
			const project = (kind, source) => {
				const file = `${kind}-${name}.${ext}`;
				const config = `tsconfig.${kind}-${name}.json`;
				writeFileSync(join(consumer, file), source);
				writeFileSync(
					join(consumer, config),
					JSON.stringify({
						compilerOptions: {
							module,
							moduleResolution,
							target: "es2022",
							lib: ["es2022", "dom"],
							strict: true,
							noEmit: true,
							skipLibCheck: false,
							types: [],
						},
						files: [file],
					}),
				);
				return runTsc(consumer, tsc, config);
			};
			const control = evaluateControl(
				project("control", controlSource(ext === "cts")),
			);
			const result = evaluateTypeCheck(
				project("consumer", consumerSource),
				control,
			);
			failed ||= !result.ok;
			console.log(
				`types ${name.padEnd(12)} ${result.ok ? "ok  " : "FAIL"} package errors: ${result.packageErrors.length}, known viem errors: ${result.upstreamErrors.length}`,
			);
			for (const line of [...result.problems, ...result.packageErrors].slice(
				0,
				5,
			))
				console.log(`  ${line}`);
		}
	}

	console.log(`\nconsumers kept in ${work}`);
	if (failed) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
