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
			reporters: process.env.CI ? ["json"] : ["verbose"],
		},
		// if you are using the default rpc you will need these to not get rate limited
		maxConcurrency: 1,
		maxThreads: 1,
		minThreads: 1,
		coverage: {
			lines: 95,
			statements: 95,
			functions: 90,
			branches: 90,
			thresholdAutoUpdate: true,
			reporter: ["text", "json-summary", "json"],
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
	},
});
