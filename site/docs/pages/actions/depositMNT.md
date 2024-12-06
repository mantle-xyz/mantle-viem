---
outline: deep
description: Initiates a MNT deposit transaction on an L1, which executes a transaction on an L2.
---

# depositMNT

Initiates a MNT deposit transaction on an L1, which executes a transaction on an L2.

Internally performs a contract write to the [`depositMNT` function](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L1StandardBridge.sol#L197) on the [Mantle L1StandardBridge contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/L1StandardBridge.sol).

## Usage

:::code-group

```ts [example.ts]
import { mantle } from 'mantle-viem/chains'
import { account, walletClientL1 } from './config'

const hash = await walletClientL1.depositMNT({
  account,
  request: {
    amount: parseEther('1'),
  },
  targetChain: mantle,
})
```

```ts [config.ts]
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { mantle } from 'mantle-viem/chains'
import { walletActionsL1 } from 'mantle-viem'

import { mainnet } from 'viem/chains'
import { mantle } from 'mantle-viem/chains'
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'

export const walletClientL1 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())

// JSON-RPC Account
export const [account] = await walletClientL1.getAddresses()
// Local Account
export const account = privateKeyToAccount(...)
```

:::

## Returns

[`Hash`](https://viem.sh/docs/glossary/types#hash)

The [L1 Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

## Parameters

### account

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  request: {
    amount: parseEther('1'),
  },
  targetChain: mantle,
})
```

### args.amount

- **Type:** `bigint`

Value in wei sent with this MNT deposit transaction on the L2. Debited from the caller's L2 balance.

```ts
const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'), // [!code focus]
  },
  targetChain: mantle,
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain to execute the transaction on.

```ts
import { mainnet } from 'viem/chains'

const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
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

const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  chain: mainnet, // [!code focus]
  targetChain: mantle,
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  maxFeePerGas: parseGwei('20'), // [!code focus]
  targetChain: mantle,
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction)

```ts
const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
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
const hash = await client.depositMNT({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  nonce: 69, // [!code focus]
  targetChain: mantle,
})
```
