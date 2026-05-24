const express = require("express");
const router = express.Router();
const QuestionSet = require("../models/QuestionSet");

// GET /api/history — get all past sessions
router.get("/", async (req, res) => {
  try {
    const history = await QuestionSet.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-questions"); // Don't return full questions list in listing
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

// GET /api/history/:id — get a specific session with full questions
router.get("/:id", async (req, res) => {
  try {
    const set = await QuestionSet.findById(req.params.id);
    if (!set) return res.status(404).json({ error: "Session not found." });
    res.json({ success: true, questionSet: set });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch session." });
  }
});

// DELETE /api/history/:id — delete a session
router.delete("/:id", async (req, res) => {
  try {
    await QuestionSet.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Session deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete session." });
  }
});

module.exports = router;
