---
outline: deep
description: Proves a withdrawal that occurred on an L2.
---

# proveWithdrawal

Proves a withdrawal that occurred on an L2. Used in the Withdrawal flow.

Internally performs a contract write to the [`proveWithdrawalTransaction` function](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol#L272) on the [Mantle Optimism Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol).

## Usage

:::code-group

```ts [example.ts]
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

const receipt = await getTransactionReceipt(publicClientL2, {
  hash: '0xbbdd0957a82a057a76b5f093de251635ac4ddc6e2d0c4aa7fbf82d73e4e11039',
})

const [withdrawal] = getWithdrawals(receipt)
const output = await publicClientL1.getL2Output({
  l2BlockNumber: receipt.blockNumber,
  targetChain: publicClientL2.chain,
})

const args = await publicClientL2.buildProveWithdrawal({
  account,
  output,
  withdrawal,
})

const hash = await walletClientL1.proveWithdrawal(args) // [!code hl]
```

```ts [config.ts]
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { mantle } from 'mantle-viem/chains'
import { publicActionsL1, publicActionsL2, walletActionsL1 } from 'mantle-viem'

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http()
}).extend(publicActionsL2())

// JSON-RPC Account
export const [account] = await walletClientL1.getAddresses()
// Local Account
export const account = privateKeyToAccount(...)
```

:::

:::warning

You must [build the parameters](#building-parameters) on the L2 before calling this function. If the gas is too low, transaction execution will fail on the L2.

:::

### Building Parameters

The [`buildProveWithdrawal` Action](/actions/buildProveWithdrawal) builds & prepares the prove withdrawal transaction parameters.

We can use the resulting `args` to prove the withdrawal transaction on the L1.

:::code-group

```ts [example.ts]
import { account, publicClientL1, publicClientL2, walletClientL1 } from './config'

const receipt = await getTransactionReceipt(publicClientL2, {
  hash: '0xbbdd0957a82a057a76b5f093de251635ac4ddc6e2d0c4aa7fbf82d73e4e11039',
})

const [withdrawal] = getWithdrawals(receipt)
const output = await publicClientL1.getL2Output({
  l2BlockNumber: receipt.blockNumber,
  targetChain: publicClientL2.chain,
})

const args = await publicClientL2.buildProveWithdrawal({ // [!code hl]
  account, // [!code hl]
  output, // [!code hl]
  withdrawal, // [!code hl]
}) // [!code hl]

const hash = await walletClientL1.proveWithdrawal(args)
```

```ts [config.ts]
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { mantle } from 'mantle-viem/chains'
import { publicActionsL1, publicActionsL2, walletActionsL1 } from 'mantle-viem'

export const walletClientL1 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())


export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http()
}).extend(publicActionsL2())

// JSON-RPC Account
export const [account] = await walletClientL1.getAddresses()
// Local Account
export const account = privateKeyToAccount(...)
```

:::

[See more on the `buildProveWithdrawal` Action.](/actions/buildProveWithdrawal)

### Account Hoisting

If you do not wish to pass an `account` to every `proveWithdrawal`, you can also hoist the Account on the Wallet Client (see `config.ts`).

[Learn more.](https://viem.sh/docs/clients/wallet#account)

:::code-group

```ts [example.ts]
import { account, publicClientL2, walletClientL1. publicClientL1 } from './config'

const receipt = await getTransactionReceipt(publicClientL2, {
  hash: '0xbbdd0957a82a057a76b5f093de251635ac4ddc6e2d0c4aa7fbf82d73e4e11039',
})

const [withdrawal] = getWithdrawals(receipt)
const output = await publicClientL1.getL2Output({
  l2BlockNumber: receipt.blockNumber,
  targetChain: publicClientL2.chain,
})

const args = await publicClientL2.buildProveWithdrawal({
  output,
  withdrawal,
})

const hash = await walletClientL1.proveWithdrawal(args)
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL1, publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider. // [!code hl]
const [account] = await window.ethereum.request({ // [!code hl]
  method: 'eth_requestAccounts', // [!code hl]
}) // [!code hl]

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account, // [!code hl]
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export const walletClientL1 = createWalletClient({
  account: privateKeyToAccount('0x...'), // [!code hl]
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

## Returns

[`Hash`](https://viem.sh/docs/glossary/types#hash)

The prove withdrawal [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

## Parameters

### account

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  l2OutputIndex: 4529n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### chain (optional)

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)
- **Default:** `client.chain`

The L1 chain. If there is a mismatch between the wallet's current chain & this chain, an error will be thrown.

```ts
import { mainnet } from 'viem/chains'

const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  chain: mainnet, // [!code focus]
  l2OutputIndex: 4529n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### gas (optional)

- **Type:** `bigint`

Gas limit for transaction execution on the L1.

`null` to skip gas estimation & defer calculation to signer.

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  gas: 420_000n, // [!code focus]
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### l2OutputIndex

- **Type:** `bigint`

The index of the L2 output. Typically derived from the [`buildProveWithdrawal` Action](/actions/buildProveWithdrawal).

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n, // [!code focus]
  gas: 420_000n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  maxFeePerGas: parseGwei('20'), // [!code focus]
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction)

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  nonce: 69, // [!code focus]
  targetchain: mantle,
})
```

### outputRootProof (optional)

- **Type:** `bigint`

The proof of the L2 output. Typically derived from the [`buildProveWithdrawal` Action](/actions/buildProveWithdrawal).

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  gas: 420_000n,
  outputRootProof: {/* ... */}, // [!code focus]
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### portalAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.portal[chainId].address`

The address of the [Mantle Optimism Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol). Defaults to the Mantle Optimism Portal contract specified on the `targetChain`.

If a `portalAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  outputRootProof: { /* ... */ },
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed' // [!code focus]
  targetchain: mantle,
  withdrawalProof: [ /* ... */ ],
  withdrawal: { /* ... */ },
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain to execute the transaction on.

```ts
import { mainnet } from 'viem/chains'

const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */},
  targetchain: mantle, // [!code focus]
})
```

### withdrawalProof

- **Type:** `bigint`

The proof of the L2 withdrawal. Typically derived from the [`buildProveWithdrawal` Action](/actions/buildProveWithdrawal).

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  gas: 420_000n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */], // [!code focus]
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### withdrawal

- **Type:** `bigint`

The withdrawal. Typically derived from the [`buildProveWithdrawal` Action](/actions/buildProveWithdrawal).

```ts
const hash = await client.proveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  l2OutputIndex: 4529n,
  gas: 420_000n,
  outputRootProof: {/* ... */},
  withdrawalProof: [/* ... */],
  withdrawal: {/* ... */}, // [!code focus]
  targetchain: mantle,
})
```
