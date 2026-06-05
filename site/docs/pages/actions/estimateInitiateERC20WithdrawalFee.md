---
outline: deep
description: Estimates the total fee (L1 data fee + L2 execution fee + operator fee) to initiate an ERC20 withdrawal on the L2.
---

# estimateInitiateERC20WithdrawalFee

Estimates the total fee (L1 data fee + L2 execution fee + operator fee) required to initiate an ERC20 withdrawal on the L2. The fee is computed by Mantle's `eth_estimateTotalFee` RPC method against the L2 bridge call.

## Usage

:::code-group

```ts [example.ts]
import { parseEther } from 'viem'
import { account, publicClientL2 } from './config'

const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
})
```

```ts [config.ts]
import { publicActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, http } from 'viem'

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const account = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
```

:::

## Returns

`bigint`

The total fee (in wei) to initiate the withdrawal on the L2.

## Parameters

### account

- **Type:** `Account | Address`

The Account to estimate the fee from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
})
```

### request.amount

- **Type:** `bigint`

The amount of the ERC20 token (in wei) to withdraw.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'), // [!code focus]
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
})
```

### request.l2Token

- **Type:** `Address`

The L2 address of the ERC20 token to withdraw.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828', // [!code focus]
  },
})
```

### request.to (optional)

- **Type:** `Address`
- **Default:** the `account` address.

The L1 recipient of the withdrawn tokens.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', // [!code focus]
  },
})
```

### gas (optional)

- **Type:** `bigint`

Gas limit for transaction execution on the L2.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  gas: 21000n, // [!code focus]
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  maxFeePerGas: parseGwei('20'), // [!code focus]
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction).

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const fee = await publicClientL2.estimateInitiateERC20WithdrawalFee({
  account,
  request: {
    amount: parseEther('1'),
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  nonce: 69, // [!code focus]
})
```
