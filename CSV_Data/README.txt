LedgerLens — Large Hackathon Mock Dataset
=============================================

Dataset size:
- 1,205 master transactions
- 1,205 gateway records
- ~1,000+ bank records (fewer because some scenarios intentionally have missing bank evidence)
- ~1,000+ ledger records (fewer because missing ledger evidence is represented by absence)

The data is intentionally designed for the LedgerLens reconciliation pipeline.

Important demo/test scenarios:
- TXN-82941 -> Gateway SUCCESS, Bank PENDING, Ledger absent -> SETTLEMENT_DELAYED
- TXN-DEMO-SUCCESS -> Gateway SUCCESS, Bank SETTLED, Ledger POSTED -> SUCCESS
- TXN-DEMO-DELAYED -> Gateway SUCCESS, Bank PENDING, Ledger absent -> SETTLEMENT_DELAYED
- TXN-DEMO-FAILED -> Gateway SUCCESS, Bank REJECTED, Ledger absent -> SETTLEMENT_FAILED
- TXN-DEMO-MISMATCH -> Gateway ₹5000, Bank ₹4500, Ledger ₹5000 -> AMOUNT_MISMATCH
- TXN-DEMO-UNKNOWN -> Gateway exists, Bank and Ledger absent -> UNKNOWN / LOW CONFIDENCE

Other records randomly include:
- timeline anomalies
- missing bank records
- missing ledger records
- duplicate bank records
- amount mismatches
- settlement delays/failures

Important implementation detail:
Do NOT create a fake ledger row with status="MISSING". A missing ledger row is deliberate evidence of absence,
matching the LedgerLens backend specification.

All source files use transactionId as the central business identifier.
