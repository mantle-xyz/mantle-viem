import { defineConfig } from "vocs";
import pkg from "../package.json";

export default defineConfig({
	title: "Mantle Viem",
	titleTemplate: "%s · Mantle Viem",
	description:
		"TypeScript extension for Viem that provides actions for working with Mantle chain.",
	ogImageUrl: {
		"/": "/og-image.png",
	},
	iconUrl: {
		light: "/favicons/NetworkMantle-dark.svg",
		dark: "/favicons/NetworkMantle.svg",
	},
	theme: {
		accentColor: {
			light: "#65b3ae",
			dark: "#65b3ae",
		},
	},
	logoUrl: { light: "/logo-dark.svg", dark: "/logo-light.svg" },
	rootDir: "./docs",
	sidebar: [
		{
			text: "Introduction",
			items: [
				{
					text: "Getting Started",
					link: "/",
				},
				{
					text: "Client",
					link: "/client",
				},
				{
					text: "Chains",
					link: "/chains",
				},
			],
		},
		{
			text: "Guides",
			items: [
				{
					text: "Deposits",
					link: "/guides/deposits",
				},
				{
					text: "Withdrawals",
					link: "/guides/withdrawals",
				},
			],
		},
		{
			text: "L2 Public Actions",
			items: [
				{
					text: "buildProveWithdrawal",
					link: "/actions/buildProveWithdrawal",
				},
			],
		},
		{
			text: "L2 Wallet Actions",
			items: [
				{
					text: "initiateMNTWithdrawal",
					link: "/actions/initiateMNTWithdrawal",
				},
				{
					text: "initiateETHWithdrawal",
					link: "/actions/initiateETHWithdrawal",
				},
				{
					text: "initiateERC20Withdrawal",
					link: "/actions/initiateERC20Withdrawal",
				},
			],
		},
		{
			text: "L1 Public Actions",
			items: [
				{
					text: "estimateDepositETHGas",
					link: "/actions/estimateDepositETHGas",
				},
				{
					text: "estimateDepositMNTGas",
					link: "/actions/estimateDepositMNTGas",
				},
				{
					text: "estimateDepositERC20Gas",
					link: "/actions/estimateDepositERC20Gas",
				},
				{
					text: "estimateFinalizeWithdrawalGas",
					link: "/actions/estimateFinalizeWithdrawalGas",
				},
				{
					text: "estimateProveWithdrawalGas",
					link: "/actions/estimateProveWithdrawalGas",
				},
				{
					text: "getL2Output",
					link: "/actions/getL2Output",
				},
				{
					text: "getTimeToFinalize",
					link: "/actions/getTimeToFinalize",
				},
				{
					text: "getTimeToNextL2Output",
					link: "/actions/getTimeToNextL2Output",
				},
				{
					text: "getTimeToProve",
					link: "/actions/getTimeToProve",
				},
				{
					text: "getWithdrawalStatus",
					link: "/actions/getWithdrawalStatus",
				},
				{
					text: "waitForNextL2Output",
					link: "/actions/waitForNextL2Output",
				},
				{
					text: "waitToFinalize",
					link: "/actions/waitToFinalize",
				},
				{
					text: "waitToProve",
					link: "/actions/waitToProve",
				},
			],
		},
		{
			text: "L1 Wallet Actions",
			items: [
				{
					text: "depositMNT",
					link: "/actions/depositMNT",
				},
				{
					text: "depositETH",
					link: "/actions/depositETH",
				},
				{
					text: "depositERC20",
					link: "/actions/depositERC20",
				},
				{
					text: "finalizeWithdrawal",
					link: "/actions/finalizeWithdrawal",
				},
				{
					text: "proveWithdrawal",
					link: "/actions/proveWithdrawal",
				},
			],
		},
		{
			text: "Utilities",
			items: [
				{
					text: "extractTransactionDepositedLogs",
					link: "/utilities/extractTransactionDepositedLogs",
				},
				{
					text: "extractWithdrawalMessageLogs",
					link: "/utilities/extractWithdrawalMessageLogs",
				},
				{
					text: "getL2TransactionHash",
					link: "/utilities/getL2TransactionHash",
				},
				{
					text: "getL2TransactionHashes",
					link: "/utilities/getL2TransactionHashes",
				},
				{
					text: "getWithdrawals",
					link: "/utilities/getWithdrawals",
				},
				{
					text: "getSourceHash",
					link: "/utilities/getSourceHash",
				},
				{
					text: "opaqueDataToDepositData",
					link: "/utilities/opaqueDataToDepositData",
				},
				{
					text: "getWithdrawalHashStorageSlot",
					link: "/utilities/getWithdrawalHashStorageSlot",
				},
				{
					text: "parseTransaction",
					link: "/utilities/parseTransaction",
				},
				{
					text: "serializeTransaction",
					link: "/utilities/serializeTransaction",
				},
			],
		},
	],
	topNav: [
		{
			text: pkg.version,
			items: [
				{
					text: "Changelog",
					link: "https://github.com/mantle-xyz/mantle-viem/blob/main/CHANGELOG.md",
				},
				{
					text: "Contributing",
					link: "https://github.com/mantle-xyz/mantle-viem/blob/main/CONTRIBUTING.md",
				},
			],
		},
	],
});
