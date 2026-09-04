import { z } from "zod";

const supportSchema = z.object({
  summary: z
    .string()
    .min(1)
    .max(2000),

  customerMessage: z
    .string()
    .min(1)
    .max(3000),

  internalNote: z
    .string()
    .min(1)
    .max(3000),

  tone: z.enum([
    "REASSURING",
    "NEUTRAL",
    "URGENT",
  ]),

  uncertainties: z
    .array(z.string())
    .max(10),
});

const validateSupport = (data) => {
  return supportSchema.parse(data);
};

export {
  supportSchema,
  validateSupport,
};