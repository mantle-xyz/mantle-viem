---
outline: deep
description: Builds & prepares parameters for a withdrawal to be initiated on an L2.
---

# getTimeToNextL2Output

Returns the time until the next L2 output (after a provided block number) is submitted. Used for the [Withdrawal](/guides/withdrawals) flow.

## Usage

:::code-group

```ts [example.ts]
import { mantle } from '@mantleio/viem/chains'
import { account, publicClientL1, publicClientL2 } from './config'

const l2BlockNumber = publicClientL2.getBlockNumber()

const { // [!code hl]
  interval, // [!code hl]
  seconds, // [!code hl]
  timestamp, // [!code hl]
} = await publicClientL1.getTimeToNextL2Output({ // [!code hl]
  l2BlockNumber, // [!code hl]
  targetChain: publicClientL2.chain, // [!code hl]
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

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: custom(window.ethereum),
})
```

:::

## Returns

`{ interval: number, seconds: number, timestamp?: number }`

- `interval`: the nominal time between L2 outputs, `SUBMISSION_INTERVAL × L2_BLOCK_TIME` read from the `L2OutputOracle`. It is the contract's minimum, not the proposer's actual cadence, and not a maximum wait.
- `seconds`: estimated seconds until an L2 output covering `l2BlockNumber` is submitted. An output covers every L2 block up to and including its own block number, so `seconds` is `0` when the latest output's block number is greater than or equal to `l2BlockNumber`.
- `timestamp`: estimated time of that output, or `undefined` when `seconds` is `0`.

The estimate is a heuristic based on the contract interval plus a buffer; actual proposal times can be earlier or later. `seconds` is also `0` when the local clock is behind the latest output's L1 timestamp. In that case `0` does not guarantee the block is already covered; use [`getL2Output`](/actions/getL2Output) or [`getWithdrawalStatus`](/actions/getWithdrawalStatus) to check.

## Parameters

### l2BlockNumber

- **Type:** `bigint`

The latest L2 block number.

```ts
const l2BlockNumber = publicClientL2.getBlockNumber() // [!code focus]
const { seconds } = await publicClientL1.getTimeToNextL2Output({
  l2BlockNumber, // [!code focus]
  targetchain: mantle,
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain.

```ts
const { seconds } = await publicClientL1.getTimeToNextL2Output({
  l2BlockNumber,
  targetchain: mantle, // [!code focus]
})
```

### intervalBuffer (optional)

- **Type:** `number`
- **Default:** `1.1`

The buffer to account for discrepancies between non-deterministic time intervals.

```ts
const { seconds } = await publicClientL1.getTimeToNextL2Output({
  intervalBuffer: 1.2, // [!code focus]
  l2BlockNumber,
  targetchain: mantle,
})
```

### l2OutputOracleAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.l2OutputOracle[chainId].address`

The address of the [L2 Output Oracle contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L2OutputOracle.sol). Defaults to the L2 Output Oracle contract specified on the `targetChain`.

If a `l2OutputOracleAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const { seconds } = await publicClientL1.getTimeToNextL2Output({
  l2BlockNumber,
  l2OutputOracleAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed', // [!code focus]
})
```
