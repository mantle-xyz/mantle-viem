---
"@mantleio/viem": minor
---

`getL2Output` now defaults to the **latest** committed output that covers a block, via a new `strategy: 'latest' | 'earliest'` parameter (defaulting to `'latest'`). Proving a withdrawal therefore reads its storage proof at a recent L2 block, removing the archive-RPC dependency for old withdrawals — without changing the finalize waiting time (which is measured from the prove timestamp). Pass `strategy: 'earliest'` to restore the previous "first covering output" behaviour.

Add `buildMigratedWithdrawal`, which reconstructs the Bedrock `Withdrawal` for a pre-Tectonic (V1/OVM) withdrawal that was migrated into the Bedrock `L2ToL1MessagePasser` during the Tectonic upgrade (these never emitted a `MessagePassed` event, so `getWithdrawals` cannot recover them). The result can be passed directly to `buildProveWithdrawal`. Also adds the `l1CrossDomainMessenger` address to the `mantle` and `mantleSepoliaTestnet` chain configs.
