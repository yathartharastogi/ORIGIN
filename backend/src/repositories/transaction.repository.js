import Transaction from "../models/Transaction.js";

const findByTransactionId = async (transactionId) => {
  return Transaction.findOne({ transactionId }).lean();
};

const findMany = async (filter = {}, options = {}) => {
  const {
    limit = 20,
    skip = 0,
    sort = { createdAt: -1 },
  } = options;

  return Transaction.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

const count = async (filter = {}) => {
  return Transaction.countDocuments(filter);
};

export {
  findByTransactionId,
  findMany,
  count,
};