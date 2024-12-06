---
description: Gets the messages from a withdrawal initialization.
---

# getWithdrawals

Gets withdrawal messages emitted from the [`MessagePassed` log](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L2/L2ToL1MessagePasser.sol#L60) from a withdrawal initialization.

## Import

```ts
import { getWithdrawals } from 'mantle-viem'
```

## Usage

```ts
import { extractTransactionDepositedLogs, getWithdrawals } from 'mantle-viem'

const receipt = await client.getTransactionReceipt({
  hash: '0xa08acae48f12243bccd7153c88d892673d5578cce4ee9988c0332e8bba47436b',
})

const withdrawals = getWithdrawals(receipt) // [!code hl]
```

## Returns

`Hex`

The L2 transaction hash.

## Parameters

### logs

- **Type:** `Log[]`

An array of L2 logs.

```ts
const withdrawals = getWithdrawals({
  logs: receipt.logs, // [!code focus]
})
```
