import Investigation from "../models/Investigation.js";

const create = async (data) => {
  return Investigation.create(data);
};

const findById = async (id) => {
  return Investigation.findById(id)
    .populate("initiatedBy", "name email role")
    .lean();
};

const findByInvestigationId = async (investigationId) => {
  return Investigation.findOne({ investigationId })
    .populate("initiatedBy", "name email role")
    .lean();
};

const findByTransactionId = async (transactionId) => {
  return Investigation.find({ transactionId })
    .sort({ createdAt: -1 })
    .populate("initiatedBy", "name email role")
    .lean();
};

const findMany = async ({
  page = 1,
  limit = 10,
  transactionId,
  severity,
  overallFinding,
  status,
}) => {
  const filter = {};

  if (transactionId) {
    filter.transactionId = transactionId;
  }

  if (severity) {
    filter.severity = severity;
  }

  if (overallFinding) {
    filter.overallFinding = overallFinding;
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [investigations, total] =
    await Promise.all([
      Investigation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(
          "initiatedBy",
          "name email role"
        )
        .lean(),

      Investigation.countDocuments(filter),
    ]);

  return {
    investigations,
    total,
  };
};

const updateById = async (id, data) => {
  return Investigation.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

const count = async (filter = {}) => {
  return Investigation.countDocuments(filter);
};

export {
  create,
  findById,
  findByInvestigationId,
  findByTransactionId,
  findMany,
  updateById,
  count,
};