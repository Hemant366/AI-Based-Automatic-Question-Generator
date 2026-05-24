const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["mcq", "open-ended"], required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  options: [String],
  answer: String,
  explanation: String,
  hint: String,
});

const questionSetSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    mode: { type: String, enum: ["basic", "ai"], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    questionType: { type: String, enum: ["mcq", "open-ended"], required: true },
    count: { type: Number, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionSet", questionSetSchema);
