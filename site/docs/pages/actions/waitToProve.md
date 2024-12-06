---
outline: deep
description: Waits until the L2 withdrawal transaction is ready to be proved.
---

# waitToProve

Waits until the L2 withdrawal transaction is ready to be proved. Used for the [Withdrawal](/guides/withdrawals) flow.

Internally calls [`getTimeToNextL2Output`](/actions/getTimeToNextL2Output) and waits the returned `seconds`.

## Usage

:::code-group

```ts [example.ts]
import { account, publicClientL1, publicClientL2 } from './config'

const receipt = await publicClientL2.getTransactionReceipt({
  hash: '0x7b5cedccfaf9abe6ce3d07982f57bcb9176313b019ff0fc602a0b70342fe3147',
})
const output = await publicClientL1.waitToProve({ // [!code hl]
  receipt, // [!code hl]
  targetChain: publicClientL2.chain, // [!code hl]
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
  transport: http(),
})
```

:::

## Returns

`WaitToProveReturnType`

The L2 output and the withdrawal message.

## Parameters

### receipt

- **Type:** `TransactionReceipt`

The transaction receipt.

```ts
const output = await publicClientL1.waitToProve({
  receipt, // [!code focus]
  targetchain: mantle,
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain.

```ts
const output = await publicClientL1.waitToProve({
  l2BlockNumber,
  targetchain: mantle, // [!code focus]
})
```

### l2OutputOracleAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.l2OutputOracle[chainId].address`

The address of the [L2 Output Oracle contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L2OutputOracle.sol). Defaults to the L2 Output Oracle contract specified on the `targetChain`.

If a `l2OutputOracleAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const output = await publicClientL1.waitToProve({
  l2BlockNumber,
  l2OutputOracleAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed', // [!code focus]
})
```
