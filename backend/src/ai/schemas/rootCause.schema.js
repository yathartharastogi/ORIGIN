import { z } from "zod";

const rootCauseSchema = z.object({
  rootCause: z
    .string()
    .min(1)
    .max(2000),

  confidence: z
    .number()
    .min(0)
    .max(100),

  supportingEvidence: z
    .array(z.string())
    .max(10),

  uncertainties: z
    .array(z.string())
    .max(10),
});

const validateRootCause = (data) => {
  return rootCauseSchema.parse(data);
};

export {
  rootCauseSchema,
  validateRootCause,
};