---
outline: deep
description: Returns the time until the withdrawal transaction can be finalized.
---

# getTimeToFinalize

Returns the time until the withdrawal transaction can be finalized. Used for the [Withdrawal](/guides/withdrawals) flow.

## Usage

:::code-group

```ts [example.ts]
import { mantle } from 'mantle-viem/chains'
import { account, publicClientL1, publicClientL2 } from './config'

const receipt = await publicClientL2.getTransactionReceipt({
  hash: '0x9a2f4283636ddeb9ac32382961b22c177c9e86dd3b283735c154f897b1a7ff4a',
})

const [message] = getWithdrawals(receipt)

const { // [!code hl]
  period, // [!code hl]
  seconds, // [!code hl]
  timestamp, // [!code hl]
} = await publicClientL1.getTimeToFinalize({ // [!code hl]
  withdrawalHash: message.withdrawalHash, // [!code hl]
  targetChain: mantle, // [!code hl]
}) // [!code hl]
```

```ts [config.ts]
import { publicActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
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

`{ period: number, seconds: number, timestamp: number }`

- `period` in seconds of the finalization stage (max wait time).
- `seconds` until the transaction can be finalized.
- `timestamp` of when the transaction can be finalized.

## Parameters

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain.

```ts
const { seconds } = await publicClientL1.getTimeToFinalize({
  withdrawalHash: '0x...', // [!code focus]
  targetChain: mantle, // [!code focus]
})
```

### withdrawalHash

- **Type:** `Hash`

The withdrawal hash.

```ts
const { seconds, timestamp } = await publicClientL1.getTimeToFinalize({
  withdrawalHash: '0x...', // [!code focus]
  targetChain: mantle,
})
```

### l2OutputOracleAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.l2OutputOracle[chainId].address`

The address of the [L2 Output Oracle contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L2OutputOracle.sol). Defaults to the L2 Output Oracle contract specified on the `targetChain`.

If a `l2OutputOracleAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const { seconds } = await publicClientL1.getTimeToFinalize({
  withdrawalHash: '0x...',
  l2OutputOracleAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed' // [!code focus]
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed'
})
```

### portalAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.portal[chainId].address`

The address of the [Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol). Defaults to the L2 Output Oracle contract specified on the `targetChain`.

If a `portalAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const { seconds } = await publicClientL1.getTimeToFinalize({
  withdrawalHash: '0x...',
  l2OutputOracleAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed', // [!code focus]
})
```
