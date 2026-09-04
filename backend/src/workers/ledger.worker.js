import {
  findManyByTransactionId,
} from "../repositories/ledger.repository.js";

const collectLedgerEvidence = async (transactionId) => {
  const records = await findManyByTransactionId(
    transactionId
  );

  return {
    source: "LEDGER",
    transactionId,
    found: records.length > 0,
    recordCount: records.length,
    records,
  };
};

export {
  collectLedgerEvidence,
};