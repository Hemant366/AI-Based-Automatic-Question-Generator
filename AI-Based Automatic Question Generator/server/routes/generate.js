const express = require("express");
const router = express.Router();
const { generateBasicQuestions } = require("../services/basicGenerator");
const { generateAIQuestions } = require("../services/aiGenerator");
const QuestionSet = require("../models/QuestionSet");

// POST /api/generate
router.post("/", async (req, res) => {
  try {
    const { topic, mode, count, difficulty, questionType, apiKey } = req.body;

    // Validation
    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Topic is required." });
    }
    if (!count || count < 1 || count > 50) {
      return res.status(400).json({ error: "Count must be between 1 and 50." });
    }
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty?.toLowerCase())) {
      return res.status(400).json({ error: "Difficulty must be easy, medium, or hard." });
    }
    const validTypes = ["mcq", "open-ended"];
    if (!validTypes.includes(questionType)) {
      return res.status(400).json({ error: "Question type must be mcq or open-ended." });
    }

    let questions;

    if (mode === "ai") {
      const effectiveKey = apiKey || process.env.GROK_API_KEY;
      questions = await generateAIQuestions(
        topic.trim(),
        parseInt(count),
        difficulty,
        questionType,
        effectiveKey
      );
    } else {
      questions = generateBasicQuestions(
        topic.trim(),
        parseInt(count),
        difficulty,
        questionType
      );
    }

    // Save to DB (best effort — don't fail if DB is down)
    try {
      const questionSet = new QuestionSet({
        topic: topic.trim(),
        mode,
        difficulty: difficulty.toLowerCase(),
        questionType,
        count: parseInt(count),
        questions,
      });
      await questionSet.save();
    } catch (dbErr) {
      console.warn("DB save skipped:", dbErr.message);
    }

    res.json({
      success: true,
      topic: topic.trim(),
      mode,
      difficulty,
      questionType,
      count: questions.length,
      questions,
    });
  } catch (err) {
    console.error("Generate error:", err.message);
    res.status(500).json({ error: err.message || "Failed to generate questions." });
  }
});

module.exports = router;
