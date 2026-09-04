import mongoose from "mongoose";

const gatewayRecordSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    gatewayReference: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING", "CANCELLED"],
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

    processedAt: {
      type: Date,
      required: true,
    },

    responseCode: {
      type: String,
      trim: true,
    },

    responseMessage: {
      type: String,
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

const GatewayRecord = mongoose.model(
  "GatewayRecord",
  gatewayRecordSchema,
  "gateway_records"
);

export default GatewayRecord;