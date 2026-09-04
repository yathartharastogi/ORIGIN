import { runOpenAI } from "../ai/openai.client.js";
import { parseAIResponse } from "../ai/response.parser.js";

import {
  validateSupport,
} from "../ai/schemas/support.schema.js";


const runSupportAgent = async ({
  transaction,
  reconciliation,
  rootCause,
  resolution,
}) => {
  const prompt = `
You are a fintech customer support specialist.

Your job is to explain a payment investigation clearly
and accurately using ONLY the verified information provided.

You must produce:
1. A concise internal summary.
2. A customer-friendly message.
3. An internal support note.
4. The appropriate communication tone.

Rules:
- Never invent transaction facts.
- Never claim a payment succeeded or failed unless the evidence supports it.
- Do not expose internal system details unnecessarily to the customer.
- Do not expose internal references, database information, or investigation logic
  in the customer message.
- If evidence is incomplete, clearly communicate the uncertainty.
- Do not promise a resolution or timeframe unless the evidence supports it.

Transaction:
${JSON.stringify(transaction, null, 2)}

Reconciliation:
${JSON.stringify(reconciliation, null, 2)}

Root Cause:
${JSON.stringify(rootCause, null, 2)}

Resolution:
${JSON.stringify(resolution, null, 2)}

Return ONLY valid JSON:

{
  "summary": "string",
  "customerMessage": "string",
  "internalNote": "string",
  "tone": "NEUTRAL",
  "uncertainties": []
}

Allowed tone values:
REASSURING
NEUTRAL
URGENT
`;

  const rawResponse = await runOpenAI(prompt);

  const parsedResponse =
    parseAIResponse(rawResponse);

  const validatedResponse =
    validateSupport(parsedResponse);

  return validatedResponse;
};


export {
  runSupportAgent,
};