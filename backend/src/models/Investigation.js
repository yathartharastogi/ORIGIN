import mongoose from "mongoose";

const investigationSchema = new mongoose.Schema(
  {
    investigationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    transactionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "COLLECTING_EVIDENCE",
        "RECONCILING",
        "ANALYZING",
        "COMPLETED",
        "FAILED",
      ],
      default: "CREATED",
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    evidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    overallFinding: {
      type: String,
      enum: [
        "SUCCESS",
        "SETTLEMENT_DELAYED",
        "SETTLEMENT_FAILED",
        "AMOUNT_MISMATCH",
        "MISSING_EVIDENCE",
        "INCONSISTENT",
        "UNKNOWN",
      ],
      default: "UNKNOWN",
    },

    anomalies: {
      type: [
        {
          code: {
            type: String,
            required: true,
          },

          severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            required: true,
          },

          message: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },

    evidenceSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    reconciliation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    aiAnalysis: {
  rootCause: {
    rootCause: {
      type: String,
      default: null,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    supportingEvidence: {
      type: [String],
      default: [],
    },

    uncertainties: {
      type: [String],
      default: [],
    },
  },

  resolution: {
    recommendedAction: {
      type: String,
      default: null,
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
        null,
      ],
      default: null,
    },

    steps: {
      type: [String],
      default: [],
    },

    escalationRequired: {
      type: Boolean,
      default: false,
    },

    escalationReason: {
      type: String,
      default: "",
    },

    uncertainties: {
      type: [String],
      default: [],
    },
  },

  support: {
    summary: {
      type: String,
      default: null,
    },

    customerMessage: {
      type: String,
      default: null,
    },

    internalNote: {
      type: String,
      default: null,
    },

    tone: {
      type: String,
      enum: [
        "REASSURING",
        "NEUTRAL",
        "URGENT",
        null,
      ],
      default: null,
    },

    uncertainties: {
      type: [String],
      default: [],
    },
  },
},

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Investigation = mongoose.model(
  "Investigation",
  investigationSchema
);

export default Investigation;