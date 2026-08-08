import { useEffect, useState } from "react";
import AnalyzeForm from "./components/AnalyzeForm";
import RiskResult from "./components/RiskResult";
import HistoryList from "./components/HistoryList";
import { useTheme } from "./hooks/useTheme";
import { analyzeContent, getHistory } from "./services/api";
import "./App.css";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cases, setCases] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  async function loadHistory() {
    setIsHistoryLoading(true);
    try {
      const data = await getHistory();
      setCases(data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleAnalyze(payload) {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeContent(payload);
      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path
                d="M12 3l7 3v5.5c0 4.2-2.9 8.1-7 9.5-4.1-1.4-7-5.3-7-9.5V6l7-3z"
                strokeLinejoin="round"
              />
              <path d="M9.2 12.2l2 2 3.6-3.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-text">
            ScamShield<span> AI</span>
          </span>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4.2" />
              <path
                d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="theme-toggle-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </nav>

      <header className="app-hero">
        <div className="hero-inner">
          <span className="app-badge">
            <span className="badge-dot" aria-hidden="true" />
            AI-Powered Protection
          </span>
          <h1>
            Spot the scam <span className="hero-gradient">before it costs you</span>
          </h1>
          <p className="hero-sub">
            Paste a suspicious message, email, or URL to get an explainable risk assessment with
            clear safety guidance — in English and Hindi.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="analyze-panel">
          <AnalyzeForm onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

          {error && (
            <p className="error-banner" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5M12 16h.01" strokeLinecap="round" />
              </svg>
              {error}
            </p>
          )}

          {result && <RiskResult result={result} />}
        </section>

        <aside className="history-aside">
          <HistoryList cases={cases} isLoading={isHistoryLoading} onRefresh={loadHistory} />
        </aside>
      </main>

      <footer className="app-footer">
        ScamShield AI · Automated guidance, not a certain verdict — always verify through official
        channels.
      </footer>
    </div>
  );
}
