---
outline: deep
description: Estimates gas to initiate a deposit ERC20 transaction on an L1, which executes a transaction on an L2.
---

# estimateDepositERC20Gas

Estimates gas to initiate a [deposit ERC20 transaction](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L1StandardBridge.sol#L240) on an L1, which executes a transaction on an L2.

## Usage

:::code-group

```ts [example.ts]
import { mantle } from '@mantleio/viem/chains'
import { account, publicClientL1 } from './config'
 
const gas = await publicClientL1.estimateDepositERC20Gas({
  account,
  request: {
    amount: parseEther('1')
    l1Token: "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c",
		l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828"
  },
  targetChain: mantle,
})
```

```ts [config.ts]
import { createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { publicActionsL1 } from '@mantleio/viem'

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())

// JSON-RPC Account
export const [account] = await publicClientL1.getAddresses()
// Local Account
export const account = privateKeyToAccount(...)
```

:::

## Returns

`bigint`

Gas required to execute the transaction on the L1.

## Parameters

### account

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  request: {
    amount: parseEther('1')
    l1Token: "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c",
		l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828"
  },
  targetChain: mantle,
})
```

### args.amount

- **Type:** `bigint`

Value in wei to mint (deposit) on the L2. Debited from the caller's L1 balance.

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1') // [!code focus]
    l1Token: "0x072d71b257ECa6B60b5333626F6a55ea1B0c451c",
		l2Token: "0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828"
  },
  targetChain: mantle,
})
```

### args.l1Token

- **Type:** `Address`

The L1 token contract address.

```ts
const hash = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c', // [!code focus]
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  targetChain: mantle,
})
```

### args.l2Token

- **Type:** `Address`

The L2 token contract address.

```ts
const hash = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828', // [!code focus]
  },
  targetChain: mantle,
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain to execute the transaction on.

```ts
import { mainnet } from 'viem/chains'

const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  chain: mainnet,
  targetChain: mantle, // [!code focus]
})
```

### chain (optional)

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)
- **Default:** `client.chain`

The L1 chain. If there is a mismatch between the wallet's current chain & this chain, an error will be thrown.

```ts
import { mainnet } from 'viem/chains'

const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  chain: mainnet, // [!code focus]
  targetChain: mantle,
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  maxFeePerGas: parseGwei('20'), // [!code focus]
  targetChain: mantle,
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction)

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
  targetChain: mantle,
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  nonce: 69, // [!code focus]
  targetChain: mantle,
})
```

### portalAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.portal[chainId].address`

The address of the [Mantle Optimism Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol). Defaults to the Mantle Optimism Portal contract specified on the `targetChain`.

If a `portalAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const gas = await client.estimateDepositERC20Gas({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    l1Token: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    l2Token: '0x9EF6f9160Ba00B6621e5CB3217BB8b54a92B2828',
  },
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed', // [!code focus]
})
```
