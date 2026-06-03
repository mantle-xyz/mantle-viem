---
"@mantleio/viem": minor
---

Add `estimateTotalFee`, `estimateInitiateMNTWithdrawalFee`, `estimateInitiateETHWithdrawalFee`, and `estimateInitiateERC20WithdrawalFee` public L2 actions. These estimate the total fee (L1 data fee + L2 execution fee + operator fee) of a transaction / withdrawal initiation via Mantle's `eth_estimateTotalFee` RPC method.
