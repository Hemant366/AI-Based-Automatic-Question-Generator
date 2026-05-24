import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import QuestionForm from "./components/QuestionForm";
import ResultsPanel from "./components/ResultsPanel";
import HistoryPage from "./components/HistoryPage";
import { generateQuestions } from "./api/questions";
import "./index.css";

function HomePage({ apiKey }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (params) => {
    setError(null);
    setLoading(true);
    setResults(null);
    try {
      const data = await generateQuestions({ ...params, apiKey });
      setResults(data);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Is the server running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">✨ AI-Powered Question Generator</div>
        <h1>Generate Smart Questions<br />Instantly</h1>
        <p>Enter any topic and get high-quality questions in seconds — powered by AI or smart templates.</p>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <QuestionForm onGenerate={handleGenerate} loading={loading} />

      {loading && (
        <div className="loading-overlay" style={{ marginTop: "2rem" }}>
          <div className="spinner" />
          <div className="loading-text">
            Generating your questions<span className="loading-dots" />
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            This may take a few seconds for AI mode
          </div>
        </div>
      )}

      {results && !loading && (
        <div id="results-section">
          <ResultsPanel data={results} onReset={() => setResults(null)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("groq_api_key") || ""
  );

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem("groq_api_key", key);
  };

  return (
    <BrowserRouter>
      <Navbar apiKey={apiKey} onSaveKey={handleSaveKey} />
      <Routes>
        <Route path="/" element={<HomePage apiKey={apiKey} />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
