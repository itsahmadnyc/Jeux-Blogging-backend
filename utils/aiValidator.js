const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const validateCommentWithAI = async (comment) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You're a strict comment filter. Reply ONLY 'true' if a comment is respectful, appropriate, and not abusive. Otherwise, reply ONLY 'false'. No other explanation.",
        },
        {
          role: "user",
          content: `Is this comment appropriate? "${comment}"`,
        },
      ],
      max_tokens: 5,
    });

    const result = response.choices[0].message.content.trim().toLowerCase();

    // Log for debugging
    console.log("AI Response:", result);

    return result === "true"; // Strict check
  } catch (err) {
    console.error("AI validation error:", err.message);
    return true; // Allow by default on failure
  }
};

module.exports = validateCommentWithAI;
