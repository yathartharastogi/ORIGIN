import { z } from "zod";

const resolutionSchema = z.object({
  recommendedAction: z
    .string()
    .min(1)
    .max(2000),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),

  steps: z
    .array(z.string())
    .min(1)
    .max(10),

  escalationRequired: z.boolean(),

  escalationReason: z
    .string()
    .max(1000),

  uncertainties: z
    .array(z.string())
    .max(10),
});

const validateResolution = (data) => {
  return resolutionSchema.parse(data);
};

export {
  resolutionSchema,
  validateResolution,
};