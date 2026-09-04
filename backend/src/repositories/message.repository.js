import Message from "../models/Message.js";


const create = async ({
  investigationId,
  userId,
  role,
  content,
}) => {
  return Message.create({
    investigationId,
    userId,
    role,
    content,
  });
};


const findByInvestigationId = async (
  investigationId
) => {
  return Message
    .find({ investigationId })
    .sort({ createdAt: 1 })
    .lean();
};


const findRecentByInvestigationId = async (
  investigationId,
  limit = 20
) => {
  return Message
    .find({ investigationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .then((messages) => messages.reverse());
};


export {
  create,
  findByInvestigationId,
  findRecentByInvestigationId,
};