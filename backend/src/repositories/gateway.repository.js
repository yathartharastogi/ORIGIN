import GatewayRecord from "../models/GatewayRecord.js";

const findByTransactionId = async (transactionId) => {
  return GatewayRecord.findOne({ transactionId }).lean();
};

const findManyByTransactionId = async (transactionId) => {
  return GatewayRecord.find({ transactionId })
    .sort({ processedAt: 1 })
    .lean();
};

export {
  findByTransactionId,
  findManyByTransactionId,
};