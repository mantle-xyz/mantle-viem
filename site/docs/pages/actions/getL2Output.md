---
outline: deep
description: Retrieves an L2 output proposal covering a provided block number (latest by default).
---

# getL2Output

Retrieves an L2 output proposal that covers a provided L2 block number. Used for the [Withdrawal](/guides/withdrawals) flow.

By default (`strategy: 'latest'`) it returns the **latest** committed output that covers the block. Proving against the latest output reads the storage proof at a recent L2 block, so it avoids an archive RPC dependency for old withdrawals — without changing the finalize waiting time (which is measured from the prove timestamp). Pass `strategy: 'earliest'` to restore the historical "first covering output" behaviour.

With `strategy: 'latest'`, the call throws `LatestL2OutputNotReadyError` when no committed output yet covers the block (whereas `strategy: 'earliest'` reverts via the L2 Output Oracle). Both map to a `waiting-to-prove` status in [`getWithdrawalStatus`](/actions/getWithdrawalStatus).

## Usage

:::code-group

```ts [example.ts]
import { mantle } from '@mantleio/viem/chains'
import { account, publicClientL1 } from './config'

const output = await publicClientL1.getL2Output({ // [!code hl]
  l2BlockNumber: 69420n, // [!code hl]
  targetChain: mantle, // [!code hl]
}) // [!code hl]
```

```ts [config.ts]
import { publicActionsL1 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())
```

:::

## Returns

`GetL2OutputReturnType`

The L2 output proposal.

## Parameters

### l2BlockNumber

- **Type:** `bigint`

The L2 block number.

```ts
const output = await publicClientL1.getL2Output({
  l2BlockNumber: 69420n, // [!code focus]
  targetChain: mantle,
})
```

### strategy (optional)

- **Type:** `'latest' | 'earliest'`
- **Default:** `'latest'`

Which output to return for the given block. `'latest'` returns the most recently committed output covering the block (avoids an archive RPC dependency for old withdrawals); `'earliest'` returns the first covering output.

```ts
const output = await publicClientL1.getL2Output({
  l2BlockNumber,
  strategy: 'earliest', // [!code focus]
  targetChain: mantle,
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain.

```ts
const output = await publicClientL1.getL2Output({
  l2BlockNumber,
  targetChain: mantle, // [!code focus]
})
```

### l2OutputOracleAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.l2OutputOracle[chainId].address`

The address of the [L2 Output Oracle contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L2OutputOracle.sol). Defaults to the L2 Output Oracle contract specified on the `targetChain`.

If a `l2OutputOracleAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const output = await publicClientL1.getL2Output({
  l2BlockNumber,
  l2OutputOracleAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed', // [!code focus]
})
```
