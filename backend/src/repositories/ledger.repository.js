import LedgerRecord from "../models/LedgerRecord.js";

const findByTransactionId = async (transactionId) => {
  return LedgerRecord.findOne({ transactionId }).lean();
};

const findManyByTransactionId = async (transactionId) => {
  return LedgerRecord.find({ transactionId })
    .sort({ postedAt: 1 })
    .lean();
};

export {
  findByTransactionId,
  findManyByTransactionId,
};