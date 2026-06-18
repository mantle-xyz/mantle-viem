---
outline: deep
description: Reconstructs the Bedrock withdrawal for a pre-Tectonic (V1/OVM) withdrawal that was migrated into the Bedrock L2ToL1MessagePasser.
---

# buildMigratedWithdrawal

Reconstructs the Bedrock `Withdrawal` for a withdrawal that was initiated before the Tectonic upgrade (V1/OVM) and migrated into the Bedrock `L2ToL1MessagePasser` during the upgrade.

These migrated withdrawals were written into the new message passer's storage by state surgery and never emitted a Bedrock `MessagePassed` event, so [`getWithdrawals`](/utilities/getWithdrawals) cannot recover them from the original receipt. This action rebuilds the withdrawal struct so it can be passed to [`buildProveWithdrawal`](/actions/buildProveWithdrawal) — and to [`getWithdrawalStatus`](/actions/getWithdrawalStatus) (via its `withdrawal` parameter) so the status can be resolved too. Used in the [Withdrawal](/guides/withdrawals) flow for legacy withdrawals.

## Usage

:::code-group

```ts [example.ts]
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

// A pre-Tectonic (V1/OVM) withdrawal transaction hash.
const withdrawal = await publicClientL2.buildMigratedWithdrawal({ // [!code hl]
  legacyTxHash:
    '0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76', // [!code hl]
}) // [!code hl]

const output = await publicClientL1.getL2Output({
  // For migrated withdrawals the original legacy L2 block isn't needed: the
  // slot exists from the Bedrock migration onward, so the latest output covers it.
  l2BlockNumber: 0n,
  targetChain: publicClientL2.chain,
})

const args = await publicClientL2.buildProveWithdrawal({
  account,
  output,
  withdrawal,
})
const hash = await walletClientL1.proveWithdrawal(args)
```

```ts [config.ts]
import {
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
} from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

export const walletClientL1 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const [account] = await walletClientL1.getAddresses()
```

:::

## Returns

`Withdrawal`

The reconstructed Bedrock withdrawal, ready to pass to [`buildProveWithdrawal`](/actions/buildProveWithdrawal).

## Parameters

### legacyTxHash

- **Type:** `Hash`

Hash of the original (pre-Tectonic) L2 withdrawal transaction.

```ts
const withdrawal = await publicClientL2.buildMigratedWithdrawal({
  legacyTxHash:
    '0xa1145ceb00b7e25091f5cb6ed18235a6893f7998e692aba3fcfecb6e4431ea76', // [!code focus]
})
```

### l1CrossDomainMessengerAddress (optional)

- **Type:** `Address`
- **Default:** `client.chain.contracts.l1CrossDomainMessenger[sourceId].address`

The L1CrossDomainMessenger address (the migrated withdrawal's target). Defaults to the address configured on the client's chain.

```ts
const withdrawal = await publicClientL2.buildMigratedWithdrawal({
  legacyTxHash: '0xa114...',
  l1CrossDomainMessengerAddress: '0x676A795fe6E43C17c668de16730c3F690FEB7120', // [!code focus]
})
```
