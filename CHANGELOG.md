# mantle-viem

## 0.1.2

### Patch Changes

- bc89e72: Fixed L2 output boundary estimates, portal version caching, and the published package entry points and types.

  - `getTimeToNextL2Output` and `getTimeToProve`: an L2 block equal to the latest output's block number is now reported as covered (`seconds: 0`), and a block exactly on a later output boundary no longer adds an extra interval. `waitForNextL2Output` and `waitToProve`, which wait for this estimate before polling, avoid the unnecessary initial delay for blocks the latest output already covers and the extra interval for blocks on a later output boundary; they still wait for the remaining estimate in the latter case.
  - `getPortalVersion`: the version cache is scoped per client, so two clients querying the same portal address no longer share a version or an RPC error.
  - The `@mantleio/viem/actions` and `@mantleio/viem/utils` entry points declared in `package.json` now exist. They re-export the same actions and utilities as the root entry point.
  - TypeScript projects using `moduleResolution: node16` or `nodenext` can now import the package from CommonJS files (previously TS1479). The `require` export condition now points to CommonJS-scoped declarations in `dist/types-cjs`; ESM, bundler and `node10` resolution use the same declarations as before.

## 0.1.1

### Patch Changes

- Republish to ship the compiled output omitted from 0.1.0's npm package. 0.1.0 shipped a stale `dist/` (built before the migrated-withdrawal / latest-output work), so `buildMigratedWithdrawal` was missing and `getL2Output`'s `strategy` parameter and the `l1CrossDomainMessenger` chain config were absent at runtime despite being documented. No source changes.

## 0.1.0

### Minor Changes

- 0ee1d42: Add `estimateTotalFee`, `estimateInitiateMNTWithdrawalFee`, `estimateInitiateETHWithdrawalFee`, and `estimateInitiateERC20WithdrawalFee` public L2 actions. These estimate the total fee (L1 data fee + L2 execution fee + operator fee) of a transaction / withdrawal initiation via Mantle's `eth_estimateTotalFee` RPC method.
- f868023: `getL2Output` now defaults to the **latest** committed output that covers a block, via a new `strategy: 'latest' | 'earliest'` parameter (defaulting to `'latest'`). Proving a withdrawal therefore reads its storage proof at a recent L2 block, removing the archive-RPC dependency for old withdrawals — without changing the finalize waiting time (which is measured from the prove timestamp). Pass `strategy: 'earliest'` to restore the previous "first covering output" behaviour.

  Add `buildMigratedWithdrawal`, which reconstructs the Bedrock `Withdrawal` for a pre-Tectonic (V1/OVM) withdrawal that was migrated into the Bedrock `L2ToL1MessagePasser` during the Tectonic upgrade (these never emitted a `MessagePassed` event, so `getWithdrawals` cannot recover them). The result can be passed directly to `buildProveWithdrawal`, and to `getWithdrawalStatus` via its new optional `withdrawal` parameter (used when the receipt contains no `MessagePassed` event, so the status of a migrated withdrawal resolves instead of throwing `ReceiptContainsNoWithdrawalsError`). Also adds the `l1CrossDomainMessenger` address to the `mantle` and `mantleSepoliaTestnet` chain configs.

### Patch Changes

- 0ee1d42: Parse the Mantle deposit transaction `ethValue` and `ethTxValue` fields. The deposit transaction parser previously only handled the 8-field OP-stack layout and rejected Mantle's 9/10-field `DepositTx`, breaking `serializeTransaction` ↔ `parseTransaction` round-trips. The `mantle` and `mantleSepoliaTestnet` chains now also use the local `chainConfig` so the Mantle formatters/serializers are actually wired in.

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
