---
head:
  - - meta
    - property: og:title
      content: Withdrawals
  - - meta
    - name: description
      content: How to withdraw from Mantle Optimism chains to Mainnet.
  - - meta
    - property: og:description
      content: How to withdraw from Mantle Optimism chains to Mainnet.

---

# Withdrawals

This guide will demonstrate how to withdraw **1 Ether** from **[Mantle (Mantle Mainnet)](https://mantle.xyz/)** to **Mainnet**.

## Overview

Withdrawals on the Mantle are a [two-step (plus one) process](https://www.mantle.xyz/blog/announcements/bridging-on-mantle-mainnet). The process involves:

0. **Initiating** the Withdrawal Transaction on the L2,

> _Wait one hour (max) for the L2 Output containing the transaction to be proposed._

1. **Proving** the Withdrawal Transaction on the L1,

> _Wait the 7 day finalization period_

2. **Finalizing** the Withdrawal Transaction on the L1.

> _Withdrawal complete!_

Here is a complete end-to-end overview of how to execute a withdrawal. Don't worry, we will break it down into [Steps](#steps) below.

:::code-group

```ts [withdrawal.ts]
import { getWithdrawals } from '@mantleio/viem'
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
  walletClientL2,
} from './config'

// Execute the initiate ETH withdrawal transaction on the L2.
const hash = await walletClientL2.initiateETHWithdrawal({
  request: {
    amount: parseEther('1'),
  },
})

// Wait for the initiate withdrawal transaction receipt.
const receipt = await publicClientL2.waitForTransactionReceipt({ hash })

// Wait until the withdrawal is ready to prove.
const { output, withdrawal } = await publicClientL1.waitToProve({
  receipt,
  targetChain: walletClientL2.chain,
})

// Build parameters to prove the withdrawal on the L2.
const proveArgs = await publicClientL2.buildProveWithdrawal({
  output,
  withdrawal,
})

// Prove the withdrawal on the L1.
const proveHash = await walletClientL1.proveWithdrawal(proveArgs)

// Wait until the prove withdrawal is processed.
const proveReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: proveHash,
})

// Wait until the withdrawal is ready to finalize.
await publicClientL1.waitToFinalize({
  targetChain: walletClientL2.chain,
  withdrawalHash: withdrawal.withdrawalHash,
})

// Finalize the withdrawal.
const finalizeHash = await walletClientL1.finalizeWithdrawal({
  targetChain: walletClientL2.chain,
  withdrawal,
})

// Wait until the withdrawal is finalized.
const finalizeReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: finalizeHash,
})
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: custom(window.ethereum),
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: http(),
}).extend(walletActionsL2())
```

:::

## Steps

### 1. Set up Viem Clients

First, we will set up our Viem Clients for the Mainnet and Mantle, including the necessary extensions for Mantle.

We will need the following clients:

- `publicClientL1`/`walletClientL1`: Public & Wallet Client for **Mainnet**
- `publicClientL2`/`walletClientL2`: Public & Wallet Client for **Mantle Mainnet**

We will place these in a `config.ts` file.

:::info

The example belows how to set up a Client for either a **JSON-RPC Account (Browser Extension, WalletConnect, etc)** or **Local Account (Private Key)**

:::

:::code-group

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: custom(window.ethereum),
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: http(),
}).extend(walletActionsL2())
```

:::

### 2. Initiate Withdrawal

Next, we will define the amount for withdrawal transaction on the L2 (1), and then executing the transaction on the L2 (2). We also want to wait for the L2 transaction to be processed on a block (3) before we continue.

In the example below, we are initiating an ETH withdrawal for **1 Ether** from the L2 (Mantle Mainnet) to the L1 (Mainnet). Withdrawal for MNT and ERC20 will need to use other actions, such like initiateMNTWithdrawal and initiateERC20Withdrawal

:::code-group

```ts [withdrawal.ts]
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL2,
} from './config'

// 1. Execute the initiate ETH withdrawal transaction on the L2.
const hash = await walletClientL2.initiateETHWithdrawal({
  request: {
    amount: parseEther('1'),
  },
})

// 2. Wait for the initiate withdrawal transaction receipt.
const receipt = await publicClientL2.waitForTransactionReceipt({ hash })
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: custom(window.ethereum),
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: http(),
}).extend(walletActionsL2())
```

:::

### 3. Prove Withdrawal

After the initiate withdrawal transaction has been processed on a block on the L2, we will then need to prove that withdrawal on the L1.

Before a withdrawal transaction can be proved, the transaction needs to be included in an L2 Output proposal. Until then, we will need to wait for the withdrawal transaction to be ready to be proved (1). This usually takes a maximum of **one hour**.

Once the L2 output has been proposed, we will need to build the parameters for the prove withdrawal transaction on the L2 (2), and then execute the transaction on the L1 (3). We also want to wait for the L1 transaction to be processed on a block (4) before we continue.

:::code-group

```ts [withdrawal.ts]
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
  walletClientL2,
} from './config'

// (Shortcut) Get receipt from transaction created in Step 1.
const receipt = await publicClientL2.getTransactionReceipt({ hash: '0x...' })

// 1. Wait until the withdrawal is ready to prove. // [!code hl]
const { output, withdrawal } = await publicClientL1.waitToProve({ // [!code hl]
  receipt, // [!code hl]
  targetChain: walletClientL2.chain, // [!code hl]
}) // [!code hl]

// 2. Build parameters to prove the withdrawal on the L2. // [!code hl]
const args = await publicClientL2.buildProveWithdrawal({ // [!code hl]
  output, // [!code hl]
  withdrawal, // [!code hl]
}) // [!code hl]

// 3. Prove the withdrawal on the L1. // [!code hl]
const hash = await walletClientL1.proveWithdrawal(args) // [!code hl]

// 4. Wait until the prove withdrawal is processed. // [!code hl]
const receipt = await publicClientL1.waitForTransactionReceipt({ // [!code hl]
  hash, // [!code hl]
}) // [!code hl]
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: custom(window.ethereum),
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: http(),
}).extend(walletActionsL2())
```

:::

:::tip
You can utilize the [`getTimeToProve`](/actions/getTimeToProve) Action if you want to extract the estimated time left to prove the withdrawal from the `waitToProve` method and display it to the user or store in a database.

```ts
const { seconds, timestamp } = await publicClientL1.getTimeToProve({
  receipt,
  targetChain: walletClientL2.chain,
})
```

:::

:::warning
If you aren't using the `waitToProve` Action, it is highly recommended to check if the withdrawal is ready to be proved by using the [`getWithdrawalStatus`](/actions/getWithdrawalStatus) Action. This will prevent you from proving a withdrawal that isn't ready yet.

```ts
const status = await publicClientL1.getWithdrawalStatus({
  receipt,
  targetChain: walletClientL2.chain,
})

if (status === 'ready-to-prove') {
  // ...
}
```

:::

### 4. Finalize Withdrawal

When the withdrawal transaction has been proved, we will then need to finalize that withdrawal on the L1.

Before a withdrawal transaction can be finalized, we will need to wait the **finalization period** of **7 days** (1).

After the finalization period has elapsed, we can finalize the withdrawal (2).

Once the withdrawal has been successfully finalized (3), then the withdrawal is complete! 🥳

:::code-group

```ts [withdrawal.ts]
import { getWithdrawals } from '@mantleio/viem'
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
  walletClientL2,
} from './config'

// (Shortcut) Get receipt from transaction created in Step 1.
const receipt = await publicClientL2.getTransactionReceipt({ hash: '0x...' })

// (Shortcut) Get withdrawals from receipt in Step 3.
const [withdrawal] = getWithdrawals(receipt)

// 1. Wait until the withdrawal is ready to finalize.  // [!code hl]
await publicClientL1.waitToFinalize({ // [!code hl]
  targetChain: walletClientL2.chain, // [!code hl]
  withdrawalHash: withdrawal.withdrawalHash, // [!code hl]
}) // [!code hl]

// 2. Finalize the withdrawal. // [!code hl]
const hash = await walletClientL1.finalizeWithdrawal({ // [!code hl]
  targetChain: walletClientL2.chain, // [!code hl]
  withdrawal, // [!code hl]
}) // [!code hl]

// 3. Wait until the withdrawal is finalized. // [!code hl]
const receipt = await publicClientL1.waitForTransactionReceipt({ // [!code hl]
  hash, // [!code hl]
}) // [!code hl]
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: custom(window.ethereum),
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
import { publicActionsL1, walletActionsL1, walletActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createWalletClient({
  account,
  chain: mantle,
  transport: http(),
}).extend(walletActionsL2())
```

:::

:::tip
You can utilize the [`getTimeToFinalize`](/actions/getTimeToFinalize) Action if you want to extract the estimated time left to finalize the withdrawal from the `waitToFinalize` method and display it to the user or store in a database.

```ts
const { seconds, timestamp } = await publicClientL1.getTimeToFinalize({
  receipt,
  targetChain: walletClientL2.chain,
})
```

:::

:::warning
If you aren't using the `waitToFinalize` Action, it is highly recommended to check if the withdrawal is ready to be finalized by using the [`getWithdrawalStatus`](/actions/getWithdrawalStatus) Action. This will prevent you from finalizing a withdrawal that isn't ready yet.

```ts
const status = await publicClientL1.getWithdrawalStatus({
  receipt,
  targetChain: walletClientL2.chain,
})

if (status === 'ready-to-finalize') {
  // ...
}
```

:::
