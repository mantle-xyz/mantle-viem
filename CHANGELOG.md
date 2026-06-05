# mantle-viem

## 0.1.0-alpha.2

### Minor Changes

- 0ee1d42: Add `estimateTotalFee`, `estimateInitiateMNTWithdrawalFee`, `estimateInitiateETHWithdrawalFee`, and `estimateInitiateERC20WithdrawalFee` public L2 actions. These estimate the total fee (L1 data fee + L2 execution fee + operator fee) of a transaction / withdrawal initiation via Mantle's `eth_estimateTotalFee` RPC method.

### Patch Changes

- 0ee1d42: Parse the Mantle deposit transaction `ethValue` and `ethTxValue` fields. The deposit transaction parser previously only handled the 8-field OP-stack layout and rejected Mantle's 9/10-field `DepositTx`, breaking `serializeTransaction` ↔ `parseTransaction` round-trips. The `mantle` and `mantleSepoliaTestnet` chains now also use the local `chainConfig` so the Mantle formatters/serializers are actually wired in.

## 0.0.1-alpha.1

### Patch Changes

- Fixed ERC20 withdrawal to correctly use `l2Token` from input instead of hardcoded value

## 0.0.1-alpha.0

### Patch Changes

- Alpha release
