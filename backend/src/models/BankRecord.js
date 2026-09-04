import mongoose from "mongoose";

const bankRecordSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    bankReference: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "RECEIVED",
        "PENDING",
        "SETTLED",
        "REJECTED",
        "FAILED",
      ],
      required: true,
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

    settlementBatchId: {
      type: String,
      index: true,
      trim: true,
    },

    receivedAt: {
      type: Date,
      required: true,
    },

    settledAt: {
      type: Date,
      default: null,
    },

    responseCode: {
      type: String,
      default: null,
      trim: true,
    },

    responseMessage: {
      type: String,
      default: null,
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const BankRecord = mongoose.model(
  "BankRecord",
  bankRecordSchema,
  "bank_records"
);

export default BankRecord;