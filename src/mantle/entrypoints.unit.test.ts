import { expect, test } from "vitest";
import * as actions from "./actions/index.js";
import * as root from "./index.js";
import * as utils from "./utils/index.js";

// The `./actions` and `./utils` package entry points only re-export symbols the
// root entry point already exports (same objects); they add no public API.

test("./actions re-exports exactly the root-exported actions", () => {
	expect(Object.keys(actions).sort()).toEqual([
		"buildMigratedWithdrawal",
		"buildProveWithdrawal",
		"estimateInitiateERC20WithdrawalFee",
		"estimateInitiateETHWithdrawalFee",
		"estimateInitiateMNTWithdrawalFee",
		"estimateTotalFee",
		"finalizeWithdrawal",
		"getL2Output",
		"getPortalVersion",
		"getTimeToFinalize",
		"getTimeToNextL2Output",
		"getTimeToProve",
		"getWithdrawalStatus",
		"proveWithdrawal",
		"waitForNextL2Output",
		"waitToFinalize",
		"waitToProve",
	]);
	for (const [name, value] of Object.entries(actions))
		expect(value).toBe((root as Record<string, unknown>)[name]);
});

test("./utils re-exports exactly the root-exported utilities", () => {
	expect(Object.keys(utils).sort()).toEqual([
		"extractTransactionDepositedLogs",
		"extractWithdrawalMessageLogs",
		"getL2TransactionHash",
		"getL2TransactionHashes",
		"getSourceHash",
		"getWithdrawalHashStorageSlot",
		"getWithdrawals",
		"opaqueDataToDepositData",
	]);
	for (const [name, value] of Object.entries(utils))
		expect(value).toBe((root as Record<string, unknown>)[name]);
});
