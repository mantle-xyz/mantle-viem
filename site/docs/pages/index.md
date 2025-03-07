# Getting Started with Mantle Viem

## Overview

mantle-viem is a TypeScript extension for [Viem](https://viem.sh) that provides actions for working with [Mantle](https://www.mantle.xyz/) L2 chain.

## Features

- Simplifies cross L1 & L2 interactions
- Seamless extension to [Viem](https://github.com/wagmi-dev/viem)
- TypeScript ready
- Test suite running against [forked](https://ethereum.org/en/glossary/#fork) Ethereum network

## Installation

:::code-group

```bash [npm]
npm i mantle-viem
```

```bash [pnpm]
pnpm i mantle-viem
```

```bash [bun]
bun i mantle-viem
```

:::

## Quick Start

### 1. Set up your Client & Transport

Firstly, set up your [Client](https://viem.sh/docs/clients/intro) with a desired [Transport](https://viem.sh/docs/clients/intro) & Mantle Chain from mantle-viem.

```ts
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  // [!code focus]
  chain: mantle, // [!code focus]
  transport: http(), // [!code focus]
}) // [!code focus]
```

### 2. Extend Client with the mantle-viem

Now that you have a Client set up, you can extend it with Mantle Actions.

```ts
import { publicActionsL2 } from '@mantleio/viem' // [!code hl]
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  chain: mantle,
  transport: http(),
}).extend(publicActionsL2()) // [!code hl]
```

### 3. Consume Mantle Actions

Now that you have an Mantle Client set up, you can now interact with Mantle and consume [Actions](/actions/depositMNT)!

```tsx
import { publicActionsL2 } from '@mantleio/viem'
import { mantle } from '@mantleio/viem/chains'
import { createPublicClient, http, parseEther } from 'viem'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsL2())

const args = await publicClient.buildProveWithdrawal({/* ... */}) // [!code hl]
```
