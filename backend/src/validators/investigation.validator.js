import { z } from "zod";

const createInvestigationSchema = z.object({
  transactionId: z.string().trim().min(1).max(100),
});

const investigationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  transactionId: z
    .string()
    .trim()
    .max(100)
    .optional(),

  severity: z
    .enum([
      "LOW",
      "MEDIUM",
      "HIGH",
      "CRITICAL",
    ])
    .optional(),

  overallFinding: z
    .enum([
      "SUCCESS",
      "SETTLEMENT_DELAYED",
      "SETTLEMENT_FAILED",
      "AMOUNT_MISMATCH",
      "MISSING_EVIDENCE",
      "INCONSISTENT",
      "UNKNOWN",
    ])
    .optional(),

  status: z
    .enum([
      "CREATED",
      "COLLECTING_EVIDENCE",
      "EVIDENCE_READY",
      "RECONCILING",
      "RECONCILED",
      "AI_ANALYSIS",
      "COMPLETED",
      "FAILED",
    ])
    .optional(),
});

const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1)
    .max(5000),
});

export {
  createInvestigationSchema,
  investigationQuerySchema,
  chatMessageSchema,
};