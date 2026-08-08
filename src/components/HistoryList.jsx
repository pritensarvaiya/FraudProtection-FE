const RISK_CLASS = {
  Low: "risk-low",
  Suspicious: "risk-suspicious",
  High: "risk-high",
};

export default function HistoryList({ cases, isLoading, onRefresh }) {
  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Analyzed cases</h3>
        <button type="button" className="btn-secondary" onClick={onRefresh} disabled={isLoading}>
          Refresh
        </button>
      </div>

      {isLoading && cases.length === 0 && <p className="history-empty">Loading history…</p>}
      {!isLoading && cases.length === 0 && <p className="history-empty">No cases analyzed yet.</p>}

      <ul className="history-list">
        {cases.map((c) => (
          <li key={c.caseId} className="history-item">
            <span className={`history-badge ${RISK_CLASS[c.riskLevel] || "risk-suspicious"}`}>
              {c.riskLevel}
            </span>
            <div className="history-details">
              <p className="history-preview">{c.contentPreview}</p>
              <span className="history-meta">
                {c.inputType} · score {c.riskScore} · {new Date(c.analyzedAtUtc).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
