import { runOpenAI } from "../ai/openai.client.js";
import { parseAIResponse } from "../ai/response.parser.js";

import {
  validateRootCause,
} from "../ai/schemas/rootCause.schema.js";


const runRootCauseAgent = async ({
  transaction,
  reconciliation,
}) => {

  const prompt = `
You are a fintech transaction investigation analyst.

Your job is to identify the most likely root cause
using ONLY the verified transaction and reconciliation data
provided below.

Rules:
- Do not invent facts.
- Do not assume missing records exist.
- Do not claim a failure unless the evidence supports it.
- If evidence is insufficient, clearly state that.
- Confidence must reflect the available evidence.

Transaction:
${JSON.stringify(transaction, null, 2)}

Reconciliation:
${JSON.stringify(reconciliation, null, 2)}

Return ONLY valid JSON:

{
  "rootCause": "string",
  "confidence": 0,
  "supportingEvidence": [],
  "uncertainties": []
}

Confidence must be between 0 and 100.
`;

  const rawResponse = await runOpenAI(prompt);

  const parsedResponse =
    parseAIResponse(rawResponse);

  const validatedResponse =
    validateRootCause(parsedResponse);

  return validatedResponse;
};


export {
  runRootCauseAgent,
};