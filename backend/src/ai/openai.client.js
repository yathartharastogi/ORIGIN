import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runOpenAI = async (prompt) => {
  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("OpenAI request failed:", error.message);

    const aiError = new Error(
      "AI analysis is currently unavailable."
    );

    aiError.code = "AI_SERVICE_UNAVAILABLE";
    aiError.statusCode = 503;

    throw aiError;
  }
};

export {
  runOpenAI,
};