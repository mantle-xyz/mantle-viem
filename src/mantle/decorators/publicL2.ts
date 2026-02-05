import type { Address } from "viem";
import type { Client, Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";
import {
	buildProveWithdrawal,
	type BuildProveWithdrawalParameters,
	type BuildProveWithdrawalReturnType,
} from "../actions/buildProveWithdrawal.js";
import {
	estimateInitiateERC20Withdrawal,
	type EstimateInitiateERC20WithdrawalGasReturnType,
	type EstimateInitiateWithdrawalERC20GasParameters,
} from "../actions/estimateInitiateERC20WithdrawalGas.js";
import {
	estimateInitiateETHWithdrawalGas,
	type EstimateInitiateETHWithdrawalGasParameters,
	type EstimateInitiateETHWithdrawalGasReturnType,
} from "../actions/estimateInitiateETHWithdrawalGas.js";
import {
	estimateInitiateMNTWithdrawalGas,
	type EstimateInitiateMNTWithdrawalGasParameters,
	type EstimateInitiateMNTWithdrawalGasReturnType,
} from "../actions/estimateInitiateMNTWithdrawalGas.js";
import {
	estimateTotalFee,
	type EstimateTotalFeeParameters,
	type EstimateTotalFeeReturnType,
} from "../actions/estimateTotalFee.js";

export type PublicActionsL2<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
> = {
	buildProveWithdrawal: <
		chainOverride extends Chain | undefined = undefined,
		accountOverride extends Account | Address | undefined = undefined,
	>(
		parameters: BuildProveWithdrawalParameters<
			chain,
			account,
			chainOverride,
			accountOverride
		>,
	) => Promise<
		BuildProveWithdrawalReturnType<
			chain,
			account,
			chainOverride,
			accountOverride
		>
	>;

	/**
	 * Estimates the L1 data fee + L2 fee to execute an L2 transaction.
	 *
	 * @param client - Client to use
	 * @param parameters - {@link EstimateTotalFeeParameters}
	 * @returns The gas estimate. {@link EstimateTotalFeeReturnType}
	 *
	 * @example
	 * import { createPublicClient, http, parseEther } from 'viem'
	 * import { optimism } from 'viem/chains'
	 * import { publicActionsL2 } from 'viem/op-stack'
	 *
	 * const client = createPublicClient({
	 *   chain: optimism,
	 *   transport: http(),
	 * }).extend(publicActionsL2())
	 *
	 * const totalFee = await client.estimateTotalFee({
	 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
	 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
	 *   value: parseEther('1'),
	 * })
	 */
	estimateTotalFee: <chainOverride extends Chain | undefined = undefined>(
		parameters: EstimateTotalFeeParameters<chain, account, chainOverride>,
	) => Promise<EstimateTotalFeeReturnType>;

	estimateInitiateMNTWithdrawalGas: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateInitiateMNTWithdrawalGasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateInitiateMNTWithdrawalGasReturnType>;
	estimateInitiateETHWithdrawalGas: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateInitiateETHWithdrawalGasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateInitiateETHWithdrawalGasReturnType>;
	estimateInitiateERC20Withdrawal: <
		chainOverride extends Chain | undefined = undefined,
	>(
		parameters: EstimateInitiateWithdrawalERC20GasParameters<
			chain,
			account,
			chainOverride
		>,
	) => Promise<EstimateInitiateERC20WithdrawalGasReturnType>;
};

export function publicActionsL2() {
	return <
		transport extends Transport,
		chain extends Chain | undefined = Chain | undefined,
		account extends Account | undefined = Account | undefined,
	>(
		client: Client<transport, chain, account>,
	): PublicActionsL2<chain, account> => {
		return {
			buildProveWithdrawal: (args) => buildProveWithdrawal(client, args),
			estimateInitiateMNTWithdrawalGas: (args) =>
				estimateInitiateMNTWithdrawalGas(client, args),
			estimateTotalFee: (args) => estimateTotalFee(client, args),
			estimateInitiateETHWithdrawalGas: (args) =>
				estimateInitiateETHWithdrawalGas(client, args),
			estimateInitiateERC20Withdrawal: (args) =>
				estimateInitiateERC20Withdrawal(client, args),
		};
	};
}
