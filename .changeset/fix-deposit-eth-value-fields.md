---
"@mantleio/viem": patch
---

Parse the Mantle deposit transaction `ethValue` and `ethTxValue` fields. The deposit transaction parser previously only handled the 8-field OP-stack layout and rejected Mantle's 9/10-field `DepositTx`, breaking `serializeTransaction` ↔ `parseTransaction` round-trips. The `mantle` and `mantleSepoliaTestnet` chains now also use the local `chainConfig` so the Mantle formatters/serializers are actually wired in.
