const axios = require("axios");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const buildPrompt = (topic, count, difficulty, questionType) => {
  const typeInstruction =
    questionType === "mcq"
      ? `Each question must be an MCQ with exactly 4 options labeled A, B, C, D. Clearly mark the correct answer.`
      : `Each question should be an open-ended question with a brief model answer hint.`;

  return `You are an expert educational question generator. Generate exactly ${count} ${difficulty.toLowerCase()} difficulty questions about the topic: "${topic}".

${typeInstruction}

Rules:
- Difficulty: ${difficulty} (Easy = basic recall, Medium = application/analysis, Hard = evaluation/synthesis)
- Questions must be relevant, clear, and educationally valuable
- No repeated questions
- Return ONLY valid JSON, no markdown, no extra text

${
  questionType === "mcq"
    ? `Return this exact JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "type": "mcq",
      "difficulty": "${difficulty.toLowerCase()}",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "answer": "The exact text of the correct option",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`
    : `Return this exact JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "type": "open-ended",
      "difficulty": "${difficulty.toLowerCase()}",
      "hint": "Brief model answer or key points to cover"
    }
  ]
}`
}`;
};

const generateAIQuestions = async (topic, count, difficulty, questionType, apiKey) => {
  if (!apiKey || apiKey === "your_grok_api_key_here") {
    throw new Error("A valid Groq API key is required for AI mode. Please add your key in Settings or in the .env file.");
  }

  const prompt = buildPrompt(topic, count, difficulty, questionType);

  let response;
  try {
    response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are an expert educational question generator. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.response?.data?.error || err.message;
    console.error("Groq API error:", JSON.stringify(err.response?.data || err.message));
    if (err.response?.status === 401) {
      throw new Error("Groq API key is invalid or expired. Generate a new key at https://console.groq.com/keys and update Settings or server/.env.");
    }
    throw new Error(`Groq API error: ${detail}`);
  }

  const text = response.data.choices[0].message.content;

  // Strip markdown code fences if present
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    // Try to extract JSON from response
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("AI returned invalid JSON. Please try again.");
    }
  }

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("AI response missing questions array.");
  }

  // Normalize and re-index
  return parsed.questions.slice(0, count).map((q, i) => ({
    ...q,
    id: i + 1,
    difficulty: difficulty.toLowerCase(),
  }));
};

module.exports = { generateAIQuestions };
