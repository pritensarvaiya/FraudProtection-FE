import { useEffect, useState } from "react";
import AnalyzeForm from "./components/AnalyzeForm";
import RiskResult from "./components/RiskResult";
import HistoryList from "./components/HistoryList";
import { analyzeContent, getHistory } from "./services/api";
import "./App.css";

export default function App() {
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
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-badge">ScamShield AI</span>
          <h1>Multilingual Digital Fraud Protection</h1>
          <p>Paste a suspicious message, email, or URL to get an explainable risk assessment and safety guidance.</p>
        </div>
      </header>

      <main className="app-main">
        <section className="analyze-panel">
          <AnalyzeForm onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          {error && <p className="error-banner">{error}</p>}
          {result && <RiskResult result={result} />}
        </section>

        <aside className="history-aside">
          <HistoryList cases={cases} isLoading={isHistoryLoading} onRefresh={loadHistory} />
        </aside>
      </main>
    </div>
  );
}
