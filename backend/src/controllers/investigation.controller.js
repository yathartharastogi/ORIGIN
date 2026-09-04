

import {
  getInvestigation,
  getInvestigations,
  startInvestigation,
} from "../services/investigation.service.js";

import {
  chatWithInvestigation,
} from "../services/chat.service.js";

import {
  getInvestigationChat,
} from "../services/chat.service.js";

const getChatHistory = async (req, res) => {
  const { id } = req.params;

  const result = await getInvestigationChat({
    investigationId: id,
  });

  res.status(200).json({
    success: true,
    data: result,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};

const chatInvestigation = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const result = await chatWithInvestigation({
    investigationId: id,
    userId: req.user._id,
    message,
  });

  res.status(200).json({
    success: true,
    data: result,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};

const getInvestigationById = async (req, res) => {
  const { id } = req.params;

  const investigation =
    await getInvestigation(id);

  res.status(200).json({
    success: true,
    data: investigation,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};

const createInvestigation = async (req, res) => {
  const {
    transactionId,
  } = req.body;

  const result = await startInvestigation({
    transactionId,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: result,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};

const getInvestigationHistory = async (req, res) => {
  const {
  page,
  limit,
  transactionId,
  severity,
  overallFinding,
  status,
} = req.validatedQuery;

  const result =
    await getInvestigations({
      page,
      limit,
      transactionId,
      severity,
      overallFinding,
      status,
    });

  res.status(200).json({
    success: true,
    data: result.investigations,
    error: null,
    meta: {
      requestId: req.id,
      pagination: result.pagination,
    },
  });
};

export {
  createInvestigation,
  getInvestigationById,
  getInvestigationHistory,
    chatInvestigation,
    getChatHistory,
};