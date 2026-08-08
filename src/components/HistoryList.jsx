const RISK_CLASS = {
  Low: "risk-low",
  Suspicious: "risk-suspicious",
  High: "risk-high",
};

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryList({ cases, isLoading, onRefresh }) {
  const showSkeletons = isLoading && cases.length === 0;

  return (
    <div className="history-panel card">
      <div className="history-header">
        <h3>
          Analyzed cases
          {cases.length > 0 && <span className="history-count">{cases.length}</span>}
        </h3>
        <button type="button" className="btn-secondary" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {showSkeletons && (
        <div className="history-list" aria-hidden="true">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {!isLoading && cases.length === 0 && (
        <div className="history-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <p>No cases analyzed yet.</p>
          <p>Your checks will appear here.</p>
        </div>
      )}

      {cases.length > 0 && (
        <ul className="history-list">
          {cases.map((c) => (
            <li key={c.caseId} className="history-item">
              <span className={`history-badge ${RISK_CLASS[c.riskLevel] || "risk-suspicious"}`}>
                {c.riskLevel}
              </span>
              <div className="history-details">
                <p className="history-preview" title={c.contentPreview}>
                  {c.contentPreview}
                </p>
                <span className="history-meta">
                  {c.inputType} · score {c.riskScore} · {formatTime(c.analyzedAtUtc)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
