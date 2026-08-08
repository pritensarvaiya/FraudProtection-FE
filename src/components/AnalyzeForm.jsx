import { useState } from "react";

const INPUT_TYPES = [
  { value: "Message", label: "Message" },
  { value: "Email", label: "Email" },
  { value: "Url", label: "URL" },
  { value: "Screenshot", label: "Screenshot (text)" },
];

export default function AnalyzeForm({ onAnalyze, isLoading }) {
  const [inputType, setInputType] = useState("Message");
  const [content, setContent] = useState("");
  const [secondaryContent, setSecondaryContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    onAnalyze({ inputType, content, secondaryContent: secondaryContent.trim() || undefined });
  }

  return (
    <form className="analyze-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="inputType">Input type</label>
        <select id="inputType" value={inputType} onChange={(e) => setInputType(e.target.value)}>
          {INPUT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="content">
          {inputType === "Url" ? "URL" : "Paste the message, email, or screenshot text"}
        </label>
        <textarea
          id="content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the suspicious content here…"
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="secondaryContent">Secondary context (optional — sender, accompanying message, etc.)</label>
        <input
          id="secondaryContent"
          type="text"
          value={secondaryContent}
          onChange={(e) => setSecondaryContent(e.target.value)}
          placeholder="e.g. sender@example.com"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? "Analyzing…" : "Analyze for fraud risk"}
      </button>
    </form>
  );
}
