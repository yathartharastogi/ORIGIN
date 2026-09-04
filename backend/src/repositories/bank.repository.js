import BankRecord from "../models/BankRecord.js";

const findByTransactionId = async (transactionId) => {
  return BankRecord.findOne({ transactionId }).lean();
};

const findManyByTransactionId = async (transactionId) => {
  return BankRecord.find({ transactionId })
    .sort({ receivedAt: 1 })
    .lean();
};

const findBySettlementBatchId = async (settlementBatchId) => {
  return BankRecord.find({ settlementBatchId })
    .sort({ receivedAt: 1 })
    .lean();
};

export {
  findByTransactionId,
  findManyByTransactionId,
  findBySettlementBatchId,
};