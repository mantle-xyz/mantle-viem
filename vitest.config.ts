export const poolId = Number(process.env.VITEST_POOL_ID ?? 1);
export const localHttpUrl = `http://127.0.0.1:8545/${poolId}`;
export const localWsUrl = `ws://127.0.0.1:8545/${poolId}`;
export const localRollupHttpUrl = `http://127.0.0.1:8555/${poolId}`;
export const localRollupWsUrl = `ws://127.0.0.1:8555/${poolId}`;
import { join } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"~test": join(__dirname, "./test"),
		},
		benchmark: {
			outputFile: "./bench/report.json",
			reporters: process.env.CI ? ["default"] : ["verbose"],
		},
		// Tests fork from public/keyed RPCs. Run files serially and retry
		// transient failures (HTTP 400 / timeout under load) so the suite stays
		// green without hammering the RPC quota.
		// NB: top-level `maxThreads`/`minThreads` are deprecated no-ops in
		// vitest 1.x — `fileParallelism: false` is what actually serializes files.
		maxConcurrency: 1,
		fileParallelism: false,
		retry: 3,
		coverage: {
			thresholds: {
				lines: 95,
				statements: 95,
				functions: 90,
				branches: 90,
				autoUpdate: true, // original thresholdAutoUpdate
			},
			reporter: process.env.CI ? ["lcov"] : ["text", "json", "html"],
			exclude: [
				"**/errors/utils.ts",
				"**/dist/**",
				"**/*.test.ts",
				"**/_test/**",
			],
			include: ["./src/mantle/utils/**"],
		},
		environment: "node",
		globalSetup: ["./test/globalSetup.ts"],
		testTimeout: 100_000,
		hookTimeout: 200_000,
	},
});
