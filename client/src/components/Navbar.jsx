import { NavLink } from "react-router-dom";
import { useState } from "react";
import SettingsModal from "./SettingsModal";

export default function Navbar({ apiKey, onSaveKey }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🧠</div>
          <span className="brand-name">QuizForge AI</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
            ✨ Generate
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            🕒 History
          </NavLink>
          <button className="btn-settings" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
        </div>
      </nav>
      {showSettings && (
        <SettingsModal apiKey={apiKey} onSave={onSaveKey} onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
