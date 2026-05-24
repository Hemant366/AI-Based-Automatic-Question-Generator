import { useState } from "react";

const LABELS = ["A", "B", "C", "D"];

export default function QuestionCard({ question, index }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleOptionClick = (option) => {
    if (selected !== null) return;
    setSelected(option);
    setRevealed(true);
  };

  const getOptionClass = (option) => {
    if (!revealed) return selected === option ? "mcq-option selected" : "mcq-option";
    if (option === question.answer) return "mcq-option correct disabled";
    if (option === selected && option !== question.answer) return "mcq-option wrong disabled";
    return "mcq-option disabled";
  };

  return (
    <div
      className="question-card"
      id={`question-${index + 1}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="q-header">
        <div className="q-number">{index + 1}</div>
        <div className="q-text">{question.question}</div>
      </div>

      {/* MCQ */}
      {question.type === "mcq" && question.options && (
        <>
          <div className="mcq-options">
            {question.options.map((option, i) => (
              <button
                key={i}
                id={`q${index + 1}-opt${i + 1}`}
                className={getOptionClass(option)}
                onClick={() => handleOptionClick(option)}
              >
                <span className="option-label">{LABELS[i]}</span>
                {option}
                {revealed && option === question.answer && (
                  <span style={{ marginLeft: "auto", fontSize: "1rem" }}>✅</span>
                )}
                {revealed && option === selected && option !== question.answer && (
                  <span style={{ marginLeft: "auto", fontSize: "1rem" }}>❌</span>
                )}
              </button>
            ))}
          </div>

          {!revealed && (
            <button
              id={`q${index + 1}-reveal`}
              className="btn-reveal"
              onClick={() => setRevealed(true)}
            >
              👁 Reveal Answer
            </button>
          )}

          {revealed && question.explanation && (
            <div className="explanation-box">
              💡 <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
        </>
      )}

      {/* Open-Ended */}
      {question.type === "open-ended" && (
        <>
          {!showHint ? (
            <button
              id={`q${index + 1}-hint`}
              className="btn-reveal"
              onClick={() => setShowHint(true)}
            >
              💡 Show Hint / Model Answer
            </button>
          ) : (
            <div className="hint-box">
              <strong>💡 HINT / KEY POINTS</strong>
              {question.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}
