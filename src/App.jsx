import { useState, useCallback } from 'react';
import { loadProblems } from './engine/problemLoader';
import { loadProgress, recordResult, resetProgress } from './engine/progressStore';
import ProblemCard from './components/ProblemCard';
import Dashboard from './components/Dashboard';
import './styles/app.css';

const problemi = loadProblems();

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [indice, setIndice] = useState(() => {
    const saved = loadProgress();
    const primo = problemi.findIndex((p) => !saved.completed[p.id]);
    return primo === -1 ? problemi.length : primo;
  });
  const [dashboardAperta, setDashboardAperta] = useState(false);
  const [nuoviBadge, setNuoviBadge] = useState([]);

  const handleCompleto = useCallback((id, tentativi, puntiBase, avanza) => {
    if (avanza) {
      setIndice((i) => i + 1);
      setNuoviBadge([]);
      return;
    }
    const { nuovoStato, puntiGuadagnati, stelle, bonusStreak } = recordResult(progress, id, tentativi, puntiBase, problemi);
    const badgeNuovi = nuovoStato.badges.filter((b) => !progress.badges.includes(b));
    setProgress(nuovoStato);
    setNuoviBadge(badgeNuovi);
    return { puntiGuadagnati, stelle, bonusStreak };
  }, [progress]);

  const handleReset = () => {
    resetProgress();
    setProgress(loadProgress());
    setIndice(0);
    setDashboardAperta(false);
  };

  const problemaCorrente = problemi[indice];

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🎓 Matematica con Luca</span>
        <button className="btn-dashboard" onClick={() => setDashboardAperta(true)}>
          👨‍👩‍👦 Genitore
        </button>
      </header>

      {nuoviBadge.length > 0 && (
        <div className="badge-popup">
          🏅 Badge sbloccato! {nuoviBadge.join(', ')}
        </div>
      )}

      <main className="app-main">
        {dashboardAperta ? (
          <Dashboard
            progress={progress}
            problemi={problemi}
            onReset={handleReset}
            onChiudi={() => setDashboardAperta(false)}
          />
        ) : problemaCorrente ? (
          <ProblemCard
            key={problemaCorrente.id}
            problema={problemaCorrente}
            onCompleto={handleCompleto}
            punteggioAttuale={progress.punteggio}
          />
        ) : (
          <div className="fine-problemi">
            <h2>🏆 Hai completato tutti i problemi!</h2>
            <p>Punteggio totale: <strong>{progress.punteggio}</strong> punti</p>
            <p>Torna presto per nuovi problemi!</p>
          </div>
        )}
      </main>
    </div>
  );
}
