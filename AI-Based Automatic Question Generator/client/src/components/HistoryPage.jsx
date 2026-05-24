import { useEffect, useState } from "react";
import { fetchHistory, deleteHistorySession, fetchHistorySession } from "../api/questions";
import ResultsPanel from "./ResultsPanel";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetchHistory();
      setHistory(res.history || []);
    } catch {
      setError("Could not load history. Make sure the server and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (id) => {
    try {
      setLoadingSession(true);
      const res = await fetchHistorySession(id);
      setSelected(res.questionSet);
    } catch {
      setError("Failed to load session.");
    } finally {
      setLoadingSession(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteHistorySession(id);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      setError("Failed to delete session.");
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (selected) {
    return (
      <div className="page">
        <button
          id="btn-back-history"
          className="btn-action"
          onClick={() => setSelected(null)}
          style={{ marginBottom: "1rem" }}
        >
          ← Back to History
        </button>
        <ResultsPanel data={selected} onReset={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero" style={{ paddingTop: "1.5rem", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)" }}>🕒 History</h1>
        <p>Revisit your previously generated question sets</p>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {loading || loadingSession ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span className="loading-text">Loading<span className="loading-dots" /></span>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No history yet</h3>
          <p>Generate some questions to see them here.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((h) => {
            const diff = h.difficulty?.toLowerCase() || "medium";
            return (
              <div
                key={h._id}
                id={`history-${h._id}`}
                className="history-card"
                onClick={() => handleOpen(h._id)}
              >
                <button
                  className="btn-delete"
                  id={`delete-${h._id}`}
                  onClick={(e) => handleDelete(e, h._id)}
                  title="Delete"
                >
                  🗑
                </button>
                <div className="history-card-title">📚 {h.topic}</div>
                <div className="history-card-meta">
                  <span className={`meta-tag ${h.mode === "ai" ? "ai" : ""}`}>
                    {h.mode === "ai" ? "🤖 AI" : "⚡ Basic"}
                  </span>
                  <span className={`meta-tag ${diff}`}>
                    {diff === "easy" ? "🟢" : diff === "medium" ? "🟡" : "🔴"} {h.difficulty}
                  </span>
                  <span className="meta-tag">
                    {h.questionType === "mcq" ? "🔘 MCQ" : "✍️ Open"}
                  </span>
                  <span className="meta-tag">📊 {h.count}Q</span>
                </div>
                <div className="history-card-date">🗓 {formatDate(h.createdAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
