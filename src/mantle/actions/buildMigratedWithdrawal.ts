import {
	decodeFunctionData,
	encodeAbiParameters,
	encodeFunctionData,
	isAddressEqual,
	keccak256,
	parseEventLogs,
	size,
} from "viem";
import type { Account, Address, Client, Hash, Transport } from "viem";
import type { Chain } from "viem";
import {
	getTransactionReceipt,
	type GetTransactionReceiptErrorType,
} from "viem/actions";
import { contracts } from "../contracts.js";
import type { ErrorType } from "../errors/utils.js";
import {
	L1CrossDomainMessengerNotFoundError,
	type L1CrossDomainMessengerNotFoundErrorType,
	MultipleLegacyWithdrawalsError,
	type MultipleLegacyWithdrawalsErrorType,
	ReceiptContainsNoWithdrawalsError,
	type ReceiptContainsNoWithdrawalsErrorType,
} from "../errors/withdrawal.js";
import type { TargetChain } from "../types/chain.js";
import type { Withdrawal } from "../types/withdrawal.js";

// Legacy (pre-Bedrock) L2CrossDomainMessenger event. Migrated withdrawals only
// emit this `SentMessage` (no Bedrock `MessagePassed`), which is why
// `getWithdrawals` cannot recover them.
const sentMessageAbi = [
	{
		type: "event",
		name: "SentMessage",
		inputs: [
			{ indexed: true, name: "target", type: "address" },
			{ indexed: false, name: "sender", type: "address" },
			{ indexed: false, name: "message", type: "bytes" },
			{ indexed: false, name: "messageNonce", type: "uint256" },
			{ indexed: false, name: "gasLimit", type: "uint256" },
		],
	},
] as const;

// Used to extract the MNT/ETH value from the inner standard-bridge call.
const finalizeWithdrawalAbi = [
	{
		type: "function",
		name: "finalizeMantleWithdrawal",
		stateMutability: "payable",
		inputs: [
			{ name: "_from", type: "address" },
			{ name: "_to", type: "address" },
			{ name: "_amount", type: "uint256" },
			{ name: "_extraData", type: "bytes" },
		],
		outputs: [],
	},
	{
		type: "function",
		name: "finalizeETHWithdrawal",
		stateMutability: "payable",
		inputs: [
			{ name: "_from", type: "address" },
			{ name: "_to", type: "address" },
			{ name: "_amount", type: "uint256" },
			{ name: "_extraData", type: "bytes" },
		],
		outputs: [],
	},
] as const;

// The migrated withdrawal's `data` is a call to the Mantle (dual-value)
// `relayMessage` on the L1CrossDomainMessenger.
const relayMessageAbi = [
	{
		type: "function",
		name: "relayMessage",
		stateMutability: "nonpayable",
		inputs: [
			{ name: "_nonce", type: "uint256" },
			{ name: "_sender", type: "address" },
			{ name: "_target", type: "address" },
			{ name: "_mntValue", type: "uint256" },
			{ name: "_ethValue", type: "uint256" },
			{ name: "_minGasLimit", type: "uint256" },
			{ name: "_message", type: "bytes" },
		],
		outputs: [],
	},
] as const;

// `MigrateWithdrawalGasLimit` from mantle-v2 `op-chain-ops/crossdomain/migrate.go`
// (non-Goerli chains). gasLimit = dataCost + overhead, capped at 25M.
const RELAY_PER_BYTE_DATA_COST = 16n; // TxDataNonZeroGasEIP2028
const RELAY_OVERHEAD =
	200_000n + // RelayConstantOverhead
	(64n * 1_000_000n) / 63n + // EIP-150 dynamic overhead on a 1M floor
	40_000n + // RelayCallOverhead
	40_000n + // RelayReservedGas
	5_000n; // RelayGasCheckBuffer
const MAX_MIGRATED_GAS_LIMIT = 25_000_000n;

function migrateWithdrawalGasLimit(data: `0x${string}`): bigint {
	const gasLimit =
		BigInt(size(data)) * RELAY_PER_BYTE_DATA_COST + RELAY_OVERHEAD;
	return gasLimit > MAX_MIGRATED_GAS_LIMIT ? MAX_MIGRATED_GAS_LIMIT : gasLimit;
}

export type BuildMigratedWithdrawalParameters = {
	/** Hash of the original (pre-Tectonic) L2 withdrawal transaction. */
	legacyTxHash: Hash;
	/**
	 * L1CrossDomainMessenger address (the migrated withdrawal's target). Defaults
	 * to the address configured on the client's chain.
	 */
	l1CrossDomainMessengerAddress?: Address | undefined;
};
export type BuildMigratedWithdrawalReturnType = Withdrawal;
export type BuildMigratedWithdrawalErrorType =
	| GetTransactionReceiptErrorType
	| L1CrossDomainMessengerNotFoundErrorType
	| MultipleLegacyWithdrawalsErrorType
	| ReceiptContainsNoWithdrawalsErrorType
	| ErrorType;

/**
 * Reconstructs the Bedrock {@link Withdrawal} for a withdrawal that was
 * initiated before the Tectonic upgrade (V1/OVM) and migrated into the Bedrock
 * `L2ToL1MessagePasser` during the upgrade.
 *
 * These migrated withdrawals were written into the new message passer's storage
 * by state surgery and never emitted a Bedrock `MessagePassed` event, so
 * {@link getWithdrawals} cannot recover them from the original receipt. This
 * action rebuilds the withdrawal struct (matching mantle-v2
 * `op-chain-ops/crossdomain` migration) so it can be passed to
 * {@link buildProveWithdrawal}.
 *
 * @param client - Client to use (L2)
 * @param parameters - {@link BuildMigratedWithdrawalParameters}
 * @returns The reconstructed withdrawal. {@link BuildMigratedWithdrawalReturnType}
 */
export async function buildMigratedWithdrawal<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: BuildMigratedWithdrawalParameters,
): Promise<BuildMigratedWithdrawalReturnType> {
	const { legacyTxHash, l1CrossDomainMessengerAddress } = parameters;

	const target =
		l1CrossDomainMessengerAddress ??
		(() => {
			const chain = client.chain as (Chain & { sourceId?: number }) | undefined;
			const sourceId = chain?.sourceId;
			const address =
				sourceId != null
					? (chain as unknown as TargetChain).contracts
							?.l1CrossDomainMessenger?.[sourceId]?.address
					: undefined;
			if (!address) {
				throw new L1CrossDomainMessengerNotFoundError();
			}
			return address;
		})();

	const receipt = await getTransactionReceipt(client, { hash: legacyTxHash });

	const logs = parseEventLogs({
		abi: sentMessageAbi,
		eventName: "SentMessage",
		logs: receipt.logs,
	});
	if (logs.length === 0) {
		throw new ReceiptContainsNoWithdrawalsError({ hash: legacyTxHash });
	}
	// A single transaction can emit multiple legacy withdrawals; this action
	// reconstructs exactly one, so surface the ambiguity rather than silently
	// dropping the others.
	if (logs.length > 1) {
		throw new MultipleLegacyWithdrawalsError({
			hash: legacyTxHash,
			count: logs.length,
		});
	}
	const [log] = logs;

	const {
		target: xDomainTarget,
		sender: xDomainSender,
		message: xDomainData,
		messageNonce,
	} = log.args;

	// The MNT/ETH value (if any) is encoded in the inner standard-bridge call.
	let mntValue = 0n;
	let ethValue = 0n;
	if (isAddressEqual(xDomainSender, contracts.l2StandardBridge.address)) {
		try {
			const decoded = decodeFunctionData({
				abi: finalizeWithdrawalAbi,
				data: xDomainData,
			});
			if (decoded.functionName === "finalizeMantleWithdrawal") {
				mntValue = decoded.args[2];
			} else if (decoded.functionName === "finalizeETHWithdrawal") {
				ethValue = decoded.args[2];
			}
		} catch {
			// Unknown selector: not a value-bearing bridge withdrawal.
		}
	}

	// Migrated withdrawals are version-0 nonces, so the versioned nonce equals
	// the legacy message nonce.
	const nonce = messageNonce;
	const sender = contracts.l2CrossDomainMessenger.address;

	const data = encodeFunctionData({
		abi: relayMessageAbi,
		functionName: "relayMessage",
		args: [
			nonce,
			xDomainSender,
			xDomainTarget,
			mntValue,
			ethValue,
			0n,
			xDomainData,
		],
	});

	const gasLimit = migrateWithdrawalGasLimit(data);

	const withdrawalHash = keccak256(
		encodeAbiParameters(
			[
				{ type: "uint256" },
				{ type: "address" },
				{ type: "address" },
				{ type: "uint256" },
				{ type: "uint256" },
				{ type: "uint256" },
				{ type: "bytes" },
			],
			[nonce, sender, target, mntValue, ethValue, gasLimit, data],
		),
	);

	return {
		nonce,
		sender,
		target,
		mntValue,
		ethValue,
		gasLimit,
		data,
		withdrawalHash,
	};
}
