import { useState } from "react";
import { jsPDF } from "jspdf";
import QuestionCard from "./QuestionCard";

export default function ResultsPanel({ data, onReset }) {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopy = () => {
    const text = data.questions
      .map((q, i) => {
        let str = `${i + 1}. ${q.question}\n`;
        if (q.type === "mcq" && q.options) {
          const labels = ["A", "B", "C", "D"];
          q.options.forEach((opt, j) => { str += `   ${labels[j]}) ${opt}\n`; });
          str += `   Answer: ${q.answer}\n`;
          if (q.explanation) str += `   Explanation: ${q.explanation}\n`;
        } else if (q.hint) {
          str += `   Hint: ${q.hint}\n`;
        }
        return str;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    showToast("📋 Copied to clipboard!");
  };

  const handleJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.topic.replace(/\s+/g, "_")}_questions.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 JSON downloaded!");
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(139, 92, 246);
    doc.text("QuizForge AI — Question Set", 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 160);
    doc.text(
      `Topic: ${data.topic}  |  Mode: ${data.mode.toUpperCase()}  |  Difficulty: ${data.difficulty}  |  Type: ${data.questionType}`,
      14, y
    );
    y += 12;

    doc.setTextColor(30, 30, 30);
    const labels = ["A", "B", "C", "D"];

    data.questions.forEach((q, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      const qLines = doc.splitTextToSize(`${i + 1}. ${q.question}`, pageW - 28);
      doc.text(qLines, 14, y);
      y += qLines.length * 6 + 2;

      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      if (q.type === "mcq" && q.options) {
        q.options.forEach((opt, j) => {
          if (y > 270) { doc.addPage(); y = 20; }
          const optLines = doc.splitTextToSize(`   ${labels[j]}) ${opt}`, pageW - 28);
          doc.text(optLines, 14, y);
          y += optLines.length * 5 + 1;
        });
        doc.setTextColor(16, 185, 129);
        doc.text(`   ✓ Answer: ${q.answer}`, 14, y);
        doc.setTextColor(30, 30, 30);
        y += 6;
        if (q.explanation) {
          const expLines = doc.splitTextToSize(`   Explanation: ${q.explanation}`, pageW - 28);
          doc.setTextColor(100, 100, 130);
          doc.text(expLines, 14, y);
          doc.setTextColor(30, 30, 30);
          y += expLines.length * 5 + 2;
        }
      } else if (q.hint) {
        doc.setTextColor(6, 182, 212);
        const hLines = doc.splitTextToSize(`   Hint: ${q.hint}`, pageW - 28);
        doc.text(hLines, 14, y);
        doc.setTextColor(30, 30, 30);
        y += hLines.length * 5 + 2;
      }
      y += 6;
    });

    doc.save(`${data.topic.replace(/\s+/g, "_")}_questions.pdf`);
    showToast("📄 PDF downloaded!");
  };

  const diffClass = data.difficulty?.toLowerCase() || "medium";

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div className="card">
        <div className="results-header">
          <div>
            <div className="section-title">📋 {data.topic}</div>
            <div className="results-meta" style={{ marginTop: "0.5rem" }}>
              <span className={`meta-tag ${data.mode === "ai" ? "ai" : ""}`}>
                {data.mode === "ai" ? "🤖 AI Mode" : "⚡ Basic Mode"}
              </span>
              <span className={`meta-tag ${diffClass}`}>
                {diffClass === "easy" ? "🟢" : diffClass === "medium" ? "🟡" : "🔴"}{" "}
                {data.difficulty?.charAt(0).toUpperCase() + data.difficulty?.slice(1)}
              </span>
              <span className="meta-tag">
                {data.questionType === "mcq" ? "🔘 MCQ" : "✍️ Open-Ended"}
              </span>
              <span className="meta-tag">📊 {data.questions.length} Questions</span>
            </div>
          </div>
          <div className="results-actions">
            <button id="btn-copy" className="btn-action" onClick={handleCopy}>📋 Copy</button>
            <button id="btn-json" className="btn-action" onClick={handleJSON}>📥 JSON</button>
            <button id="btn-pdf" className="btn-action primary" onClick={handlePDF}>📄 PDF</button>
            <button id="btn-new" className="btn-action" onClick={onReset}>✨ New</button>
          </div>
        </div>

        <div className="questions-list">
          {data.questions.map((q, i) => (
            <QuestionCard key={q.id || i} question={q} index={i} />
          ))}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
