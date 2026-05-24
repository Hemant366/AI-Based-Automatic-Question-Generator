import { useState } from "react";

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(key.trim());
    setSaved(true);
    setTimeout(onClose, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Groq API Key (for AI Mode)</label>
          <div className="api-key-info">
            Get a free key at{" "}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
              console.groq.com
            </a>
            . Your key is stored locally in your browser only.
          </div>
          <input
            id="api-key-input"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="gsk_..."
          />
        </div>

        <button className="btn-save" onClick={handleSave}>
          {saved ? "✅ Saved!" : "💾 Save Key"}
        </button>
      </div>
    </div>
  );
}
