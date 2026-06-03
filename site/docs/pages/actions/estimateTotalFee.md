---
outline: deep
description: Estimates the total fee (L1 data fee + L2 execution fee + operator fee) to execute a transaction on the L2.
---

# estimateTotalFee

Estimates the total fee (L1 data fee + L2 execution fee + operator fee) required to execute a transaction on the L2, as computed by Mantle's `eth_estimateTotalFee` RPC method.

## Usage

:::code-group

```ts [example.ts]
import { parseEther } from 'viem'
import { account, publicClientL2 } from './config'

const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

```ts [config.ts]
import { createPublicClient, http } from 'viem'
import { mantle } from '@mantleio/viem/chains'
import { publicActionsL2 } from '@mantleio/viem'

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http()
}).extend(publicActionsL2())

export const account = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
```

:::

## Returns

`bigint`

The total fee (in wei) to execute the transaction on the L2.

## Parameters

### account (optional)

- **Type:** `Account | Address`
- **Default:** `client.account`

The Account to estimate the fee from. The node accepts a request without `from`, so this is optional.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const fee = await publicClientL2.estimateTotalFee({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // [!code focus]
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

### to (optional)

- **Type:** `Address`

The transaction recipient.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', // [!code focus]
  value: parseEther('1'),
})
```

### value (optional)

- **Type:** `bigint`

Value (in wei) sent with this transaction.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'), // [!code focus]
})
```

### data (optional)

- **Type:** `0x${string}`

Contract code or a hashed method call with encoded args.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  data: '0xdeadbeef', // [!code focus]
})
```

### gas (optional)

- **Type:** `bigint`

Gas limit for transaction execution on the L2.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
  gas: 21000n, // [!code focus]
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
  maxFeePerGas: parseGwei('20'), // [!code focus]
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction).

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const fee = await publicClientL2.estimateTotalFee({
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
  nonce: 69, // [!code focus]
})
```
