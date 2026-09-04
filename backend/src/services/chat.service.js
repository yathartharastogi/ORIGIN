import {
  findByInvestigationId as findInvestigationByPublicId,
} from "../repositories/investigation.repository.js";

import {
  create as createMessage,
  findRecentByInvestigationId,
  findByInvestigationId as findMessagesByInvestigationId,
} from "../repositories/message.repository.js";

import {
  runOpenAI,
} from "../ai/openai.client.js";

import {
  parseAIResponse,
} from "../ai/response.parser.js";


const buildChatPrompt = ({
  investigation,
  messages,
  userMessage,
}) => {
  const conversation = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  return `
You are LedgerLens Support Agent.

You are answering a follow-up question about an existing
fintech transaction investigation.

Use ONLY the verified investigation data and conversation
provided below.

Rules:
- Do not invent transaction facts.
- Do not change or contradict the reconciliation result.
- Do not assume missing records exist.
- Clearly state uncertainty when the evidence is incomplete.
- Do not claim a payment succeeded or failed unless the
  investigation evidence supports it.
- Answer the support agent's question directly.
- Keep the answer concise and practical.
- Do not expose database implementation details unless
  specifically relevant to the question.

VERIFIED INVESTIGATION:

${JSON.stringify(
  {
    investigationId:
      investigation.investigationId,

    transactionId:
      investigation.transactionId,

    status:
      investigation.status,

    severity:
      investigation.severity,

    evidenceScore:
      investigation.evidenceScore,

    overallFinding:
      investigation.overallFinding,

    anomalies:
      investigation.anomalies,

    evidenceSnapshot:
      investigation.evidenceSnapshot,

    reconciliation:
      investigation.reconciliation,

    aiAnalysis:
      investigation.aiAnalysis,
  },
  null,
  2
)}


PREVIOUS CONVERSATION:

${JSON.stringify(
  conversation,
  null,
  2
)}


CURRENT QUESTION:

${userMessage}


Return ONLY valid JSON:

{
  "answer": "string",
  "uncertainties": []
}
`;
};


const chatWithInvestigation = async ({
  investigationId,
  userId,
  message,
}) => {

  /*
   * 1. Find the investigation using
   *    the public investigationId.
   */

  const investigation =
  await findInvestigationByPublicId(
    investigationId
  );

  if (!investigation) {
    const error = new Error(
      "Investigation was not found."
    );

    error.code =
      "INVESTIGATION_NOT_FOUND";

    error.statusCode = 404;

    throw error;
  }


  /*
   * 2. Save the user's message.
   *
   * Message.investigationId expects
   * MongoDB ObjectId, so use _id.
   */

  const userMessage =
  await createMessage({
    investigationId:
      investigation._id,

    userId,

    role: "USER",

    content: message,
  });


  /*
   * 3. Get recent conversation history.
   */

  const previousMessages =
    await findRecentByInvestigationId(
      investigation._id,
      20
    );


  /*
   * 4. Build AI prompt.
   */

  const prompt =
    buildChatPrompt({
      investigation,
      messages: previousMessages,
      userMessage: message,
    });


  /*
   * 5. Ask OpenAI.
   */

  let aiResponse;

  try {
    aiResponse =
      await runOpenAI(prompt);
  } catch (error) {
    /*
     * We already saved the user message.
     * AI failure should be returned as an
     * AI service error.
     */

    throw error;
  }


  /*
   * 6. Parse AI JSON.
   */

  const parsedResponse =
  parseAIResponse(aiResponse);


  /*
   * 7. Validate basic response shape.
   */

  if (
    !parsedResponse.answer ||
    typeof parsedResponse.answer !==
      "string"
  ) {
    const error = new Error(
      "AI returned an invalid answer."
    );

    error.code =
      "AI_INVALID_RESPONSE";

    error.statusCode = 502;

    throw error;
  }


  /*
   * 8. Save assistant response.
   */

  const assistantMessage =
    await createMessage({
      investigationId:
        investigation._id,

      userId,

      role: "ASSISTANT",

      content:
        parsedResponse.answer,
    });


  /*
   * 9. Return result.
   */

  return {
    userMessage: {
  id: userMessage._id,
  content: userMessage.content,
},

    assistantMessage: {
      id: assistantMessage._id,
      content:
        parsedResponse.answer,
      uncertainties:
        parsedResponse.uncertainties || [],
    },
  };
};

const getInvestigationChat = async ({
  investigationId,
}) => {

  const investigation =
    await findInvestigationByPublicId(
      investigationId
    );

  if (!investigation) {
    const error = new Error(
      "Investigation was not found."
    );

    error.code =
      "INVESTIGATION_NOT_FOUND";

    error.statusCode = 404;

    throw error;
  }

  const messages =
    await findMessagesByInvestigationId(
      investigation._id
    );

  return messages;
};

export {
  chatWithInvestigation,
  getInvestigationChat,
};