import { useState } from "react";

const INPUT_TYPES = [
  { value: "Message", label: "Message" },
  { value: "Email", label: "Email" },
  { value: "Url", label: "URL" },
  { value: "Screenshot", label: "Screenshot" },
];

const PLACEHOLDERS = {
  Message: "Paste the suspicious SMS or WhatsApp message here…",
  Email: "Paste the full email content, including the subject line…",
  Url: "https://suspicious-link.example.com/login",
  Screenshot: "Paste the text you read from the screenshot…",
};

const LABELS = {
  Message: "Message content",
  Email: "Email content",
  Url: "URL to check",
  Screenshot: "Text from the screenshot",
};

export default function AnalyzeForm({ onAnalyze, isLoading }) {
  const [inputType, setInputType] = useState("Message");
  const [content, setContent] = useState("");
  const [secondaryContent, setSecondaryContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    onAnalyze({
      inputType,
      content,
      secondaryContent: secondaryContent.trim() || undefined,
    });
  }

  return (
    <form className="analyze-form card" onSubmit={handleSubmit}>
      <div className="form-head">
        <h2>Check something suspicious</h2>
        <p>Get an explainable risk assessment in seconds.</p>
      </div>

      <div className="field-group">
        <label htmlFor="content-input">Input type</label>
        <div className="segmented" role="group" aria-label="Input type">
          {INPUT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={inputType === t.value ? "active" : ""}
              aria-pressed={inputType === t.value}
              onClick={() => setInputType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="content-input">{LABELS[inputType]}</label>
        <textarea
          id="content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={PLACEHOLDERS[inputType]}
          required
        />
        {content.length > 0 && (
          <p className="field-hint">{content.length.toLocaleString()} characters</p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="secondary-input">
          Sender or extra context <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="secondary-input"
          type="text"
          value={secondaryContent}
          onChange={(e) => setSecondaryContent(e.target.value)}
          placeholder="e.g. sender@example.com or +91 98765 43210"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading || !content.trim()}>
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analyzing…
          </>
        ) : (
          "Analyze for fraud risk"
        )}
      </button>
    </form>
  );
}
