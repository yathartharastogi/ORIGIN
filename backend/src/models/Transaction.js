import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },

    merchantId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    customerReference: {
      type: String,
      trim: true,
    },

    transactionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      required: true,
    },

    transactionTimestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);

export default Transaction;