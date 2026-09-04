import express from "express";

import {
  getTransaction,
} from "../controllers/transaction.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";


const router = express.Router();


router.get(
  "/:transactionId",
  protect,
  getTransaction
);


export default router;