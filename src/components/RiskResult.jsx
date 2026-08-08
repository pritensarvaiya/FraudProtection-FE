import { useState } from "react";

const RISK_STYLES = {
  Low: { className: "risk-low", label: "Low Risk" },
  Suspicious: { className: "risk-suspicious", label: "Suspicious" },
  High: { className: "risk-high", label: "High Risk" },
};

export default function RiskResult({ result }) {
  const [language, setLanguage] = useState("en");
  const riskStyle = RISK_STYLES[result.riskLevel] || RISK_STYLES.Suspicious;

  return (
    <div className={`risk-result ${riskStyle.className}`}>
      <div className="risk-header">
        <span className="risk-badge">{riskStyle.label}</span>
        <span className="risk-score">Risk score: {result.riskScore}/100</span>
      </div>

      <p className="risk-summary">{result.summary}</p>

      {result.evidence?.length > 0 && (
        <section className="evidence-section">
          <h3>Evidence behind this assessment</h3>
          <ul className="evidence-list">
            {result.evidence.map((item, idx) => (
              <li key={idx} className="evidence-item">
                <span className="evidence-pattern">{item.pattern}</span>
                <blockquote className="evidence-snippet">"{item.snippet}"</blockquote>
                <p className="evidence-reason">{item.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.recommendedActions?.length > 0 && (
        <section className="actions-section">
          <h3>Recommended next actions</h3>
          <ul className="actions-list">
            {result.recommendedActions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="guidance-section">
        <div className="guidance-header">
          <h3>Safety guidance</h3>
          <div className="language-toggle" role="group" aria-label="Guidance language">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              type="button"
              className={language === "hi" ? "active" : ""}
              onClick={() => setLanguage("hi")}
            >
              हिन्दी
            </button>
          </div>
        </div>
        <p className="guidance-text">
          {language === "en" ? result.guidanceEnglish : result.guidanceHindi}
        </p>
      </section>

      <p className="risk-disclaimer">
        This is automated risk guidance, not a certain verdict. Use your own judgement and verify through
        official channels before acting.
      </p>
    </div>
  );
}
