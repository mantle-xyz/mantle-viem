---
outline: deep
description: Initiates a ETH withdrawal on an L2 to the L1.
---

# initiateETHWithdrawal

Initiates a ETH withdrawal on an L2 to the L1.

Internally performs a contract write to the [`withdraw` function](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L2/L2StandardBridge.sol#L106C5-L106C22) on the [Mantle L2StandardBridge predeploy contract](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L2/L2StandardBridge.sol).

## Usage

:::code-group

```ts [example.ts]
import { mantle } from '@mantleio/viem'
import { account, walletClientL2 } from './config'

// User might need to update allowance for first time deposit.
const approvalHash = await walletClientL2.writeContract({
  account,
  address: "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111", //L2 ETH
  abi:erc20Abi,
  functionName:'approve',
  args:[mantle.contracts.l2StandardBridge.address,parseEther('1')]
})

const hash = await walletClientL2.initiateETHWithdrawal({
  account,
  request: {
    amount: parseEther('1'),
  },
})
```

```ts [config.ts]
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { walletActionsL2 } from '@mantleio/viem'

export const walletClientL2 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL2())

// JSON-RPC Account
export const [account] = await walletClientL2.getAddresses()
// Local Account
export const account = privateKeyToAccount(...)
```

:::

## Returns

[`Hash`](https://viem.sh/docs/glossary/types#hash)

The [L2 Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

## Parameters

### account

- **Type:** `Account | Address`

The Account to send the transaction from.

Accepts a [JSON-RPC Account](https://viem.sh/docs/clients/wallet#json-rpc-accounts) or [Local Account (Private Key, etc)](https://viem.sh/docs/clients/wallet#local-accounts-private-key-mnemonic-etc).

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  request: {
    amount: parseEther('1'),
  },
  targetChain: mantle,
})
```

### args.amount

- **Type:** `bigint`

Amount in wei to ETH withdrawal from the L2 to the L1. Debited from the caller's L2 balance.

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'), // [!code focus]
  },
})
```

### args.to (optional)

- **Type:** `Address`

L1 Transaction recipient.

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
    to: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // [!code focus]
  },
  targetChain: mantle,
})
```

### chain (optional)

- **Type:** [`Chain`](https://viem.sh/docs/glossary/types#chain)
- **Default:** `client.chain`

The L2 chain. If there is a mismatch between the wallet's current chain & this chain, an error will be thrown.

```ts
import { mantle } from '@mantleio/viem/chains'

const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  chain: mantle, // [!code focus]
})
```

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`.

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  maxFeePerGas: parseGwei('20'), // [!code focus]
})
```

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). Only applies to [EIP-1559 Transactions](https://viem.sh/docs/glossary/terms#eip-1559-transaction)

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  maxFeePerGas: parseGwei('20'),
  maxPriorityFeePerGas: parseGwei('2'), // [!code focus]
})
```

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.

```ts
const hash = await client.initiateETHWithdrawal({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  request: {
    amount: parseEther('1'),
  },
  nonce: 69, // [!code focus]
})
```
