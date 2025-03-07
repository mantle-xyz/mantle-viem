---
outline: deep
description: Finalizes a withdrawal that occurred on an L2.
---

# finalizeWithdrawal

Finalizes a withdrawal that occurred on an L2. Used in the Withdrawal flow.

Internally performs a contract write to the [`finalizeWithdrawalTransaction` function](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol#L355) on the [Mantle Optimism Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol).

## Usage

:::code-group

```ts [example.ts]
import { account, publicClientL2, walletClientL1 } from './config'

const receipt = await getTransactionReceipt(publicClientL2, {
  hash: '0xbbdd0957a82a057a76b5f093de251635ac4ddc6e2d0c4aa7fbf82d73e4e11039',
})

const [withdrawal] = getWithdrawals(receipt)

const hash = await walletClientL1.finalizeWithdrawal({ // [!code hl]
  account, // [!code hl]
  targetChain: publicClientL2.chain, // [!code hl]
  withdrawal, // [!code hl]
}) // [!code hl]
```

```ts [config.ts]
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { mantle } from '@mantleio/viem/chains'
import { publicActionsL2, walletActionsL1 } from '@mantleio/viem'

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

### Account Hoisting

If you do not wish to pass an `account` to every `finalizeWithdrawal`, you can also hoist the Account on the Wallet Client (see `config.ts`).

[Learn more.](https://viem.sh/docs/clients/wallet#account)

:::code-group

```ts [example.ts]
import { account, publicClientL2, walletClientL1 } from './config'

const receipt = await getTransactionReceipt(publicClientL2, {
  hash: '0xbbdd0957a82a057a76b5f093de251635ac4ddc6e2d0c4aa7fbf82d73e4e11039',
})

const [withdrawal] = getWithdrawals(receipt)

const hash = await walletClientL1.finalizeWithdrawal({
  account, // [!code --]
  targetChain: publicClientL2.chain,
  withdrawal,
})
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL2, walletActionsL1 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider. // [!code ++]
const [account] = await window.ethereum.request({ // [!code ++]
  method: 'eth_requestAccounts', // [!code ++]
}) // [!code ++]

export const walletClientL1 = createWalletClient({
  account, // [!code ++]
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL2, walletActionsL1 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export const walletClientL1 = createWalletClient({
  account: privateKeyToAccount('0x...'), // [!code ++]
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

The finalize withdrawal [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

## Parameters

### account

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
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

const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  chain: mainnet, // [!code focus]
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### gas (optional)

- **Type:** `bigint`

Gas limit for transaction execution on the L1.

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  gas: 420_000n, // [!code focus]
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  maxFeePerGas: parseGwei('20'), // [!code focus]
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction)

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
  withdrawal: {/* ... */},
  targetchain: mantle,
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  withdrawal: {/* ... */},
  nonce: 69, // [!code focus]
  targetchain: mantle,
})
```

### portalAddress (optional)

- **Type:** `Address`
- **Default:** `targetChain.contracts.portal[chainId].address`

The address of the [Mantle Optimism Portal contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L1/OptimismPortal.sol). Defaults to the Mantle Optimism Portal contract specified on the `targetChain`.

If a `portalAddress` is provided, the `targetChain` parameter becomes optional.

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed' // [!code focus]
  targetchain: mantle,
  withdrawal: { /* ... */ },
})
```

### targetChain

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)

The L2 chain to execute the transaction on.

```ts
import { mainnet } from 'viem/chains'

const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  withdrawal: {/* ... */},
  targetchain: mantle, // [!code focus]
})
```

### withdrawal

- **Type:** `bigint`

The withdrawal.

```ts
const hash = await client.finalizeWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  gas: 420_000n,
  withdrawal: {/* ... */}, // [!code focus]
  targetchain: mantle,
})
```
