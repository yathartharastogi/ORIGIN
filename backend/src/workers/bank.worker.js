import {
  findManyByTransactionId,
} from "../repositories/bank.repository.js";

const collectBankEvidence = async (transactionId) => {
  const records = await findManyByTransactionId(
    transactionId
  );

  return {
    source: "BANK",
    transactionId,
    found: records.length > 0,
    recordCount: records.length,
    records,
  };
};

export {
  collectBankEvidence,
};