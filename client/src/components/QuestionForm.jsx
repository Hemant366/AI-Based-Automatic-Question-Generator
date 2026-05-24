import { useState } from "react";

export default function QuestionForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("basic");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionType, setQuestionType] = useState("mcq");
  const [count, setCount] = useState(5);

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setCount(val);
    const pct = ((val - 1) / 49) * 100;
    e.target.style.setProperty("--pct", `${pct}%`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, mode, difficulty, questionType, count });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="section-title">🎯 Configure Your Quiz</div>
        <div className="section-subtitle">Set your topic and preferences below</div>

        <div className="form-grid">
          {/* Topic */}
          <div className="form-group full">
            <label htmlFor="topic-input">Topic / Subject</label>
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, World War II, Photosynthesis..."
              required
            />
          </div>

          {/* Mode */}
          <div className="form-group">
            <label>Generation Mode</label>
            <div className="toggle-group">
              <button
                type="button"
                id="mode-basic"
                className={`toggle-btn ${mode === "basic" ? "active" : ""}`}
                onClick={() => setMode("basic")}
              >
                ⚡ Basic
              </button>
              <button
                type="button"
                id="mode-ai"
                className={`toggle-btn ${mode === "ai" ? "active" : ""}`}
                onClick={() => setMode("ai")}
              >
                🤖 AI
              </button>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {mode === "basic"
                ? "⚡ Fast, offline template-based generation"
                : "🤖 Smart AI-powered (requires Groq API key in Settings)"}
            </div>
          </div>

          {/* Question Type */}
          <div className="form-group">
            <label>Question Type</label>
            <div className="toggle-group">
              <button
                type="button"
                id="type-mcq"
                className={`toggle-btn ${questionType === "mcq" ? "active" : ""}`}
                onClick={() => setQuestionType("mcq")}
              >
                🔘 MCQ
              </button>
              <button
                type="button"
                id="type-open"
                className={`toggle-btn ${questionType === "open-ended" ? "active" : ""}`}
                onClick={() => setQuestionType("open-ended")}
              >
                ✍️ Open-Ended
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="form-group full">
            <label>Difficulty Level</label>
            <div className="diff-group">
              {["easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  type="button"
                  id={`diff-${d}`}
                  data-diff={d}
                  className={`diff-btn ${difficulty === d ? "active" : ""}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === "easy" ? "🟢" : d === "medium" ? "🟡" : "🔴"}{" "}
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="form-group full">
            <label>Number of Questions</label>
            <div className="slider-row">
              <input
                id="count-slider"
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={handleSlider}
                style={{ "--pct": `${((count - 1) / 49) * 100}%` }}
              />
              <span className="slider-value">{count}</span>
            </div>
          </div>
        </div>

        <button
          id="generate-btn"
          type="submit"
          className="btn-generate"
          disabled={loading || !topic.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Generating<span className="loading-dots" />
            </>
          ) : (
            <>✨ Generate {count} {questionType === "mcq" ? "MCQ" : "Open-Ended"} Questions</>
          )}
        </button>
      </div>
    </form>
  );
}
