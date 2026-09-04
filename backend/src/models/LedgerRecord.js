import mongoose from "mongoose";

const ledgerRecordSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    ledgerReference: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["POSTED", "PENDING", "REVERSED"],
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

    postedAt: {
      type: Date,
      default: null,
    },

    entryType: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    accountReference: {
      type: String,
      required: true,
      index: true,
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

const LedgerRecord = mongoose.model(
  "LedgerRecord",
  ledgerRecordSchema,
  "ledger_records"
);

export default LedgerRecord;