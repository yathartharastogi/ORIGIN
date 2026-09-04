import { runOpenAI } from "../ai/openai.client.js";
import { parseAIResponse } from "../ai/response.parser.js";

import {
  validateResolution,
} from "../ai/schemas/resolution.schema.js";


const runResolutionAgent = async ({
  transaction,
  reconciliation,
  rootCause,
}) => {

  const prompt = `
You are a fintech operations resolution specialist.

Your job is to recommend practical next steps
for resolving a payment investigation.

Use ONLY the verified transaction,
reconciliation findings, and root cause provided below.

Rules:
- Do not invent transaction facts.
- Do not assume missing records exist.
- Do not recommend actions unsupported by the evidence.
- If evidence is insufficient, clearly state the uncertainty.
- Prioritize actions that a fintech support or operations team
  can realistically perform.
- Escalate when the evidence indicates a serious issue.

Transaction:
${JSON.stringify(transaction, null, 2)}

Reconciliation:
${JSON.stringify(reconciliation, null, 2)}

Root Cause Analysis:
${JSON.stringify(rootCause, null, 2)}

Return ONLY valid JSON:

{
  "recommendedAction": "string",
  "priority": "LOW",
  "steps": [
    "string"
  ],
  "escalationRequired": false,
  "escalationReason": "",
  "uncertainties": []
}
`;

  const rawResponse = await runOpenAI(prompt);

  const parsedResponse =
    parseAIResponse(rawResponse);

  const validatedResponse =
    validateResolution(parsedResponse);

  return validatedResponse;
};


export {
  runResolutionAgent,
};