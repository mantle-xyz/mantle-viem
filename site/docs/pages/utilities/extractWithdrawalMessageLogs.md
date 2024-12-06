---
description: Extracts "MessagePassed" logs from a withdrawal initialization from an opaque array of logs.
---

# extractWithdrawalMessageLogs

Extracts [`MessagePassed` logs](https://github.com/mantlenetworkio/mantle-v2/blob/v1.0.0-alpha.1/packages/contracts-bedrock/contracts/L2/L2ToL1MessagePasser.sol#L60) from a withdrawal initialization from an opaque array of logs.

## Import

```ts
import { extractWithdrawalMessageLogs } from 'mantle-viem'
```

## Usage

```ts
import { extractWithdrawalMessageLogs } from 'mantle-viem'

const receipt = await client.getTransactionReceipt({
  hash: '0xc9c0361bc3da9cd3560e48b469d0d6aac0e633e4897895edfd26a287f7c578ec',
})

const logs = extractWithdrawalMessageLogs(receipt)
// [
//   { args: { ... }, blockHash: '0x...', eventName: 'MessagePassed'  },
//   { args: { ... }, blockHash: '0x...', eventName: 'MessagePassed'  },
//   { args: { ... }, blockHash: '0x...', eventName: 'MessagePassed'  },
// ]
```

## Returns

`Log[]`

The `MessagePassed` logs.

## Parameters

### logs

- **Type:** `Log[]`

An array of opaque logs.

```ts
const logs = extractWithdrawalMessageLogs({
  logs: receipt.logs, // [!code focus]
})
```
