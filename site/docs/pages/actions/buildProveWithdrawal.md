---
outline: deep
description: Builds the transaction that proves a withdrawal was initiated on an L2. 
---

# buildProveWithdrawal

Builds the transaction that proves a withdrawal was initiated on an L2. Used in the Withdrawal flow.

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
import { publicClientL1, publicActionsL2, walletActionsL1 } from 'mantle-viem'


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

### Account Hoisting

If you do not wish to pass an `account` to every `buildProveWithdrawal`, you can also hoist the Account on the Wallet Client (see `config.ts`).

[Learn more](https://viem.sh/docs/clients/wallet#account).

:::code-group

```ts [example.ts]
import { publicClientL2, walletClientL1 } from './config'

const args = await publicClientL2.buildProveWithdrawal({
  output,
  withdrawal,
})

const hash = await walletClientL1.proveWithdrawal(args)
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider. // [!code hl]
const [account] = await window.ethereum.request({ // [!code hl]
  method: 'eth_requestAccounts', // [!code hl]
}) // [!code hl]

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

`BuildProveWithdrawalReturnType`

The parameters required to execute a [prove withdrawal transaction](/actions/proveWithdrawal).

## Parameters

### account (optional)

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const args = await client.buildProveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  output,
  withdrawal,
})
```

### output

- **Type:** `GetL2OutputReturnType`

The L2 output. Typically provided by [`getL2Output` Action](/actions/getL2Output).

```ts
const args = await client.buildProveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  output: {/* ... */}, // [!code focus]
  withdrawal,
})
```

### withdrawal

- **Type:** `Withdrawal`

The withdrawal message. Typically provided by [`getWithdrawals` Action](/utilities/getWithdrawals).

```ts
const args = await client.buildProveWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  output,
  withdrawal: {/* ... */}, // [!code focus]
})
```
