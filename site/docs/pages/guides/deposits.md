---
head:
  - - meta
    - property: og:title
      content: Deposits
  - - meta
    - name: description
      content: How to deposit from Mainnet to Mantle.
  - - meta
    - property: og:description
      content: How to deposit from Mainnet to Mantle.

---

# Deposits

This guide will demonstrate how to deposit (bridge) **1 Ether** from **Mainnet** to **[Mantle Mainnet](https://mantle.xyz/)**.

## Overview

Here is an end-to-end overview of how to execute a deposit transaction. We will break it down into [Steps](#steps) below.

:::code-group

```ts [deposit.ts]
import { getL2TransactionHashes } from 'mantle-viem'
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositETH({
  request: {
    amount: parseEther('1'),
  },
})

// Wait for the L1 transaction to be processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ hash })

// Get the L2 transaction hash from the L1 transaction receipt.
const [l2Hash] = getL2TransactionHashes(receipt)

// Wait for the L2 transaction to be processed.
const l2Receipt = await publicClientL2.waitForTransactionReceipt({
  hash: l2Hash,
})
```

```ts [config.ts (JSON-RPC Account)]
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
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
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

## Steps

### 1. Set up Viem Clients

First, we will set up our Viem Clients for the Mainnet and Mantle, including the necessary extensions for Mantle chain.

We will place these in a `config.ts` file.

:::info

The example belows how to set up a Client for either a **JSON-RPC Account (Browser Extension, WalletConnect, etc)** or **Local Account (Private Key)**

:::

:::code-group

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

### 2. Execute the Deposit Transaction

Next, we will define the deposit transaction on the Mantle (L2) chain using the Clients that we created in the previous step.

In the example below, we want to deposit **1 Ether** (via `amount`) onto the Mantle chain.

:::info

The `amount` value is the value to deposit (mint) on the Mantle chain. It is debited from the account's Mainnet (L1) balance.

:::

After that, we will execute the deposit transaction on the Mainnet (L1) chain.

:::code-group

```ts [deposit.ts]
// Import Viem Clients.
import { account, publicClientL2, walletClientL1 } from './config'

// Execute the deposit transaction on the L1. // [!code focus]
const hash = await walletClientL1.depositTransaction({ // [!code focus]
  request: { // [!code focus]
    // Define deposit amount.
    amount: parseEther('1'), // [!code focus]
  }, // [!code focus]
}) // [!code focus]
```

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const clientL1 = createClient({
  account,
  chain: mainnet,
  transport: fallback([custom(window.ethereum), http()]),
})
  .extend(publicActions)
  .extend(walletActionsL1())

export const clientL2 = createClient({
  chain: mantle,
  transport: http(),
})
  .extend(publicActions)
  .extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

### 3. Wait for Transaction to be Processed

Once we have broadcast the transaction to the Mainnet (L1) chain, we need to wait for it to be processed on a block so we can extract the transaction receipt. We will need the transaction receipt to extract the transaction on the Mantle (L2) chain.

:::info

When the transaction has been processed, the `amount` value (1 Ether) will be debited from the account's Mainnet (L1) balance.

:::

:::code-group

```ts [deposit.ts]
// Import Viem Clients.
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositTransaction({
  request: {
    amount: parseEther('1'),
  },
})

// Wait for the L1 transaction to be processed. // [!code focus]
const receipt = await publicClientL1.waitForTransactionReceipt({ hash }) // [!code focus]
```

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const clientL1 = createClient({
  account,
  chain: mainnet,
  transport: fallback([custom(window.ethereum), http()]),
})
  .extend(publicActions)
  .extend(walletActionsL1())

export const clientL2 = createClient({
  chain: mantle,
  transport: http(),
})
  .extend(publicActions)
  .extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

### 4. Compute the L2 Transaction Hash

Once we have the transaction receipt from the Mainnet (L1) chain, we can extract the Mantle (L2) transaction hash from the logs in the transaction receipt.

:::code-group

```ts [deposit.ts]
// Import Viem Clients.
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositTransaction({
  request: {
    amount: parseEther('1'),
  },
})

// Wait for the L1 transaction to be processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ hash })

// Get the L2 transaction hash from the L1 transaction receipt. // [!code focus]
const [l2Hash] = getL2TransactionHashes(receipt) // [!code focus]
```

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const clientL1 = createClient({
  account,
  chain: mainnet,
  transport: fallback([custom(window.ethereum), http()]),
})
  .extend(publicActions)
  .extend(walletActionsL1())

export const clientL2 = createClient({
  chain: mantle,
  transport: http(),
})
  .extend(publicActions)
  .extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::

### 5. Wait for Transaction to be Processed

Now that we have the Mantle (L2) transaction hash, we can wait for the transaction to be processed on the Mantle (L2) chain.

Once the `waitForTransactionReceipt` call resolves, the transaction has been processed and you should now be credited with 1 Ether on the Mantle (L2) chain 🥳.

:::code-group

```ts [deposit.ts]
// Import Viem Clients.
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
} from './config'

// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositTransaction({
  request: {
    amount: parseEther('1'),
  },
})

// Wait for the L1 transaction to be processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ hash })

// Get the L2 transaction hash from the L1 transaction receipt.
const [l2Hash] = getL2TransactionHashes(receipt)

// Wait for the L2 transaction to be processed. // [!code focus]
const l2Receipt = await publicClientL2.waitForTransactionReceipt({ // [!code focus]
  hash: l2Hash, // [!code focus]
}) // [!code focus]
```

```ts [config.ts (JSON-RPC Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'

// Retrieve Account from an EIP-1193 Provider.
export const [account] = await window.ethereum.request({
  method: 'eth_requestAccounts',
})

export const clientL1 = createClient({
  account,
  chain: mainnet,
  transport: fallback([custom(window.ethereum), http()]),
})
  .extend(publicActions)
  .extend(walletActionsL1())

export const clientL2 = createClient({
  chain: mantle,
  transport: http(),
})
  .extend(publicActions)
  .extend(publicActionsL2())
```

```ts [config.ts (Local Account)]
// Import Viem modules.
import { publicActionsL2, walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2())
```

:::
