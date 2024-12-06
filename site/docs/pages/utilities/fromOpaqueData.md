---
description: Decodes opaque deposit data found in the "TransactionDeposited" event log.
---

# opaqueDataToDepositData

Decodes opaque deposit data found in the `TransactionDeposited` event log data.

## Import

```ts
import { opaqueDataToDepositData } from 'mantle-viem'
```

## Usage

```ts
import { opaqueDataToDepositData } from 'mantle-viem'

const data = opaqueDataToDepositData(
  '0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000045000000000000526c01deadbeef',
)
```

## Returns

```
{
  mint: bigint
  value: bigint
  ethValue: bigint
  ethTxValue: bigint
  gas: bigint
  isCreation: boolean
  data: Hex
}
```

The decoded opaque data.

## Parameters

### opaqueData

- **Type:** `Hex`

The ABI (packed) encoded opaque data.
