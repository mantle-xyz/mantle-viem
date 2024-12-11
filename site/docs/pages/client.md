# Client [Setting up your Viem Client with Mantle]

To use the Mantle functionality of Viem, you must extend your existing (or new) Viem Client with Mantle Actions.

## Usage

### Layer 1 Extensions

```ts
import { walletActionsL1 } from 'mantle-viem' // [!code hl]
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(),
}).extend(walletActionsL1()) // [!code hl]

const hash = await walletClient.depositMNT({/* ... */})
```

### Layer 2 Extensions

```ts
import { publicActionsL2 } from 'mantle-viem' // [!code hl]
import { mantle } from 'mantle-viem/chains'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2()) // [!code hl]

const args = await publicClient.buildProveWithdrawal({/* ... */})
```

## Extensions

### `walletActionsL1`

A suite of [Wallet Actions](/actions/depositMNT) for suited for development with **Layer 1** chains that interact with **Layer 2 (Mantle)** chain.

```ts
import { walletActionsL1 } from 'mantle-viem'
```

### `publicActionsL1`

A suite of [Public Actions](/actions/estimateFinalizeWithdrawalGas) suited for development with **Layer 1** chains. These actions provide functionalities specific to public clients operating at the Layer 1 level, enabling them to interact seamlessly with Mantle.

```ts
import { publicActionsL1 } from 'mantle-viem'
```

### `walletActionsL2`

A suite of [Wallet Actions](/actions/initiateMNTWithdrawal) suited for development with **Layer 2 (Mantle)** chain. These actions are tailored for wallets operating on Layer 2, providing advanced features and integrations necessary for Layer 2 financial operations.

```ts
import { walletActionsL2 } from 'mantle-viem'
```

### `publicActionsL2`

A suite of [Public Actions](/actions/buildProveWithdrawal) for suited for development with **Layer 2 (Mantle)** chain.

```ts
import { publicActionsL2 } from 'mantle-viem'
```
