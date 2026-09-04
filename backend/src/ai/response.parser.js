const parseAIResponse = (response) => {
  if (!response || typeof response !== "string") {
    const error = new Error(
      "AI returned an empty response."
    );

    error.code = "AI_EMPTY_RESPONSE";
    throw error;
  }

  let cleanedResponse = response.trim();

  /*
   * Sometimes the model wraps JSON inside
   * ```json ... ```
   */
  if (cleanedResponse.startsWith("```")) {
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error(
      "Failed to parse AI response:",
      cleanedResponse
    );

    const aiError = new Error(
      "AI returned an invalid response."
    );

    aiError.code = "AI_INVALID_RESPONSE";
    aiError.statusCode = 502;

    throw aiError;
  }
};

export {
  parseAIResponse,
};