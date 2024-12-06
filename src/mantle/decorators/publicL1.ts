import type { Client, Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";

import {
	estimateDepositETHGas,
	type EstimateDepositETHGasParameters,
	type EstimateDepositETHGasReturnType,
} from "../actions/estimateDepositETHGas.js";
import {
	estimateDepositMNTGas,
	type EstimateDepositMNTGasParameters,
	type EstimateDepositMNTGasReturnType,
} from "../actions/estimateDepositMNTGas.js";
import {
	estimateFinalizeWithdrawalGas,
	type EstimateFinalizeWithdrawalGasParameters,
	type EstimateFinalizeWithdrawalGasReturnType,
} from "../actions/estimateFinalizeWithdrawalGas.js";
import {
	estimateProveWithdrawalGas,
	type EstimateProveWithdrawalGasParameters,
	type EstimateProveWithdrawalGasReturnType,
} from "../actions/estimateProveWithdrawalGas.js";
import {
	getL2Output,
	type GetL2OutputParameters,
	type GetL2OutputReturnType,
} from "../actions/getL2Output.js";
import {
	getPortalVersion,
	type GetPortalVersionParameters,
	type GetPortalVersionReturnType,
} from "../actions/getPortalVersion.js";
import {
	getTimeToFinalize,
	type GetTimeToFinalizeParameters,
	type GetTimeToFinalizeReturnType,
} from "../actions/getTimeToFinalize.js";
import {
	getTimeToNextL2Output,
	type GetTimeToNextL2OutputParameters,
	type GetTimeToNextL2OutputReturnType,
} from "../actions/getTimeToNextL2Output.js";
import {
	getTimeToProve,
	type GetTimeToProveParameters,
	type GetTimeToProveReturnType,
} from "../actions/getTimeToProve.js";
import {
	getWithdrawalStatus,
	type GetWithdrawalStatusParameters,
	type GetWithdrawalStatusReturnType,
} from "../actions/getWithdrawalStatus.js";
import {
	waitForNextL2Output,
	type WaitForNextL2OutputParameters,
	type WaitForNextL2OutputReturnType,
} from "../actions/waitForNextL2Output.js";
import {
	waitToFinalize,
	type WaitToFinalizeParameters,
	type WaitToFinalizeReturnType,
} from "../actions/waitToFinalize.js";
import {
	waitToProve,
	type WaitToProveParameters,
	type WaitToProveReturnType,
} from "../actions/waitToProve.js";

import {
	estimateDepositERC20Gas,
	type EstimateDepositERC20GasParameters,
	type EstimateDepositERC20GasReturnType,
} from "../actions/estimateDepositERC20Gas.js";

export type PublicActionsL1<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
> = {
	estimateProveWithdrawalGas: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateProveWithdrawalGasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateProveWithdrawalGasReturnType>;

	estimateFinalizeWithdrawalGas: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateFinalizeWithdrawalGasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateFinalizeWithdrawalGasReturnType>;

	getL2Output: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetL2OutputParameters<chain, chainOverride>,
	) => Promise<GetL2OutputReturnType>;

	getPortalVersion: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetPortalVersionParameters<chain, chainOverride>,
	) => Promise<GetPortalVersionReturnType>;

	getTimeToFinalize: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetTimeToFinalizeParameters<chain, chainOverride>,
	) => Promise<GetTimeToFinalizeReturnType>;

	getTimeToNextL2Output: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetTimeToNextL2OutputParameters<chain, chainOverride>,
	) => Promise<GetTimeToNextL2OutputReturnType>;

	getTimeToProve: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetTimeToProveParameters<chain, chainOverride>,
	) => Promise<GetTimeToProveReturnType>;

	getWithdrawalStatus: <chainOverride extends Chain | undefined = undefined>(
		parameters: GetWithdrawalStatusParameters<chain, chainOverride>,
	) => Promise<GetWithdrawalStatusReturnType>;

	waitForNextL2Output: <chainOverride extends Chain | undefined = undefined>(
		parameters: WaitForNextL2OutputParameters<chain, chainOverride>,
	) => Promise<WaitForNextL2OutputReturnType>;

	waitToFinalize: <chainOverride extends Chain | undefined = undefined>(
		parameters: WaitToFinalizeParameters<chain, chainOverride>,
	) => Promise<WaitToFinalizeReturnType>;

	waitToProve: <chainOverride extends Chain | undefined = undefined>(
		parameters: WaitToProveParameters<chain, chainOverride>,
	) => Promise<WaitToProveReturnType>;
	estimateDepositMNTGas: <chainOverride extends Chain | undefined = undefined>(
		parameters: EstimateDepositMNTGasParameters<chain, account, chainOverride>,
	) => Promise<EstimateDepositMNTGasReturnType>;

	estimateDepositETHGas: <chainOverride extends Chain | undefined = undefined>(
		parameters: EstimateDepositETHGasParameters<chain, account, chainOverride>,
	) => Promise<EstimateDepositETHGasReturnType>;

	estimateDepositERC20Gas: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateDepositERC20GasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateDepositERC20GasReturnType>;
};

export function publicActionsL1() {
	return <
		transport extends Transport,
		chain extends Chain | undefined = Chain | undefined,
		account extends Account | undefined = Account | undefined,
	>(
		client: Client<transport, chain, account>,
	): PublicActionsL1<chain, account> => {
		return {
			estimateFinalizeWithdrawalGas: (args) =>
				estimateFinalizeWithdrawalGas(client, args),
			estimateProveWithdrawalGas: (args) =>
				estimateProveWithdrawalGas(client, args),
			getL2Output: (args) => getL2Output(client, args),
			getPortalVersion: (args) => getPortalVersion(client, args),
			getTimeToFinalize: (args) => getTimeToFinalize(client, args),
			getTimeToNextL2Output: (args) => getTimeToNextL2Output(client, args),
			getTimeToProve: (args) => getTimeToProve(client, args),
			getWithdrawalStatus: (args) => getWithdrawalStatus(client, args),
			waitForNextL2Output: (args) => waitForNextL2Output(client, args),
			waitToFinalize: (args) => waitToFinalize(client, args),
			waitToProve: (args) => waitToProve(client, args),
			estimateDepositMNTGas: (args) => estimateDepositMNTGas(client, args),
			estimateDepositETHGas: (args) => estimateDepositETHGas(client, args),
			estimateDepositERC20Gas: (args) => estimateDepositERC20Gas(client, args),
		};
	};
}
