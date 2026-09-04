import express from "express";

import {
  createInvestigation,
  getInvestigationById,
    getInvestigationHistory,
    chatInvestigation,
    getChatHistory,
} from "../controllers/investigation.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validation.middleware.js";

import {
  createInvestigationSchema,
  investigationQuerySchema,
  chatMessageSchema,
} from "../validators/investigation.validator.js";


const router = express.Router();


router.post(
  "/",
  protect,
  validate(createInvestigationSchema),
  createInvestigation
);

router.get(
  "/",
  protect,
  validate(
    investigationQuerySchema,
    "query"
  ),
  getInvestigationHistory
);

router.get(
  "/:id",
  protect,
  getInvestigationById
);

router.post(
  "/:id/chat",
  protect,
  validate(chatMessageSchema),
  chatInvestigation
);

router.get(
  "/:id/chat",
  protect,
  getChatHistory
);


export default router;