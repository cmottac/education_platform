import { useState, useCallback } from 'react';
import { loadProblems } from './engine/problemLoader';
import { loadProgress, recordResult, resetProgress, saveNome, BADGES } from './engine/progressStore';
import { problemiPerAmbito, AMBITI } from './engine/ambiti';
import ProblemCard from './components/ProblemCard';
import Dashboard from './components/Dashboard';
import Benvenuto from './components/Benvenuto';
import SceltaAmbito from './components/SceltaAmbito';
import './styles/app.css';

const tuttiProblemi = loadProblems();

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [ambitoAttivo, setAmbitoAttivo] = useState(null);
  const [problemaCorrenteId, setProblemaCorrenteId] = useState(null);
  const [dashboardAperta, setDashboardAperta] = useState(false);
  const [nuoviBadge, setNuoviBadge] = useState([]);
  const [cercaAperto, setCercaAperto] = useState(false);
  const [cercaQuery, setCercaQuery] = useState('');

  const nome = progress.nome;

  const problemiFiltrati = ambitoAttivo ? problemiPerAmbito(tuttiProblemi, ambitoAttivo) : [];

  const problemaCorrente = (() => {
    if (!ambitoAttivo) return null;
    if (problemaCorrenteId) {
      const p = problemiFiltrati.find((p) => p.id === problemaCorrenteId);
      if (p) return p;
    }
    return problemiFiltrati.find((p) => !progress.completed[p.id]) ?? null;
  })();

  const problemiCercati = cercaQuery.trim()
    ? tuttiProblemi.filter((p) =>
        p.id.includes(cercaQuery.trim()) ||
        p.titolo.toLowerCase().includes(cercaQuery.trim().toLowerCase())
      )
    : [];

  const saltaA = (problema) => {
    const ambito = AMBITI.find((a) => a.categorie.includes(problema.categoria));
    if (ambito) setAmbitoAttivo(ambito.id);
    setProblemaCorrenteId(problema.id);
    setCercaAperto(false);
    setCercaQuery('');
  };

  const handleNome = (n) => {
    const nuovoStato = saveNome(n);
    setProgress(nuovoStato);
  };

  const handleAmbitoScelta = (ambitoId) => {
    setAmbitoAttivo(ambitoId);
    setProblemaCorrenteId(null);
  };

  const handleCompleto = useCallback((id, tentativi, puntiBase, avanza) => {
    if (avanza) {
      setProblemaCorrenteId(null);
      setNuoviBadge([]);
      return;
    }
    const { nuovoStato, puntiGuadagnati, stelle, bonusStreak } = recordResult(progress, id, tentativi, puntiBase, tuttiProblemi);
    const badgeNuovi = nuovoStato.badges.filter((b) => !progress.badges.includes(b));
    setProblemaCorrenteId(id);
    setProgress(nuovoStato);
    setNuoviBadge(badgeNuovi);
    return { puntiGuadagnati, stelle, bonusStreak };
  }, [progress]);

  const handleReset = () => {
    resetProgress();
    setProgress(loadProgress());
    setAmbitoAttivo(null);
    setProblemaCorrenteId(null);
    setDashboardAperta(false);
  };

  if (!nome) return <Benvenuto onConferma={handleNome} />;

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🎓 Ciao {nome}!</span>
        <div className="header-actions">
          <span className="punteggio-header">⭐ {progress.punteggio} punti</span>

          <div className="cerca-wrapper">
            <button className="btn-dashboard" onClick={() => setCercaAperto((v) => !v)}>
              🔍 Vai a...
            </button>
            {cercaAperto && (
              <div className="cerca-dropdown">
                <input
                  className="cerca-input"
                  autoFocus
                  placeholder="ID o titolo problema..."
                  value={cercaQuery}
                  onChange={(e) => setCercaQuery(e.target.value)}
                />
                <div className="cerca-risultati">
                  {problemiCercati.length === 0 && cercaQuery.trim() && (
                    <div className="cerca-vuoto">Nessun risultato</div>
                  )}
                  {problemiCercati.map((p) => (
                    <div key={p.id} className="cerca-item" onClick={() => saltaA(p)}>
                      <span className="cerca-id">#{p.id}</span> {p.titolo}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="btn-dashboard" onClick={() => setDashboardAperta(true)}>
            👨‍👩‍👦 Genitore
          </button>
        </div>
      </header>

      {nuoviBadge.length > 0 && (
        <div className="badge-popup">
          🏅 Badge sbloccato! {nuoviBadge.map((id) => BADGES.find((b) => b.id === id)?.label).join(', ')}
        </div>
      )}

      <main className="app-main">
        {dashboardAperta ? (
          <Dashboard
            progress={progress}
            problemi={tuttiProblemi}
            nome={nome}
            onReset={handleReset}
            onChiudi={() => setDashboardAperta(false)}
          />
        ) : !ambitoAttivo ? (
          <SceltaAmbito
            nome={nome}
            problemi={tuttiProblemi}
            progress={progress}
            ambitoAttivo={ambitoAttivo}
            onScelta={handleAmbitoScelta}
          />
        ) : problemaCorrente ? (
          <>
            <button className="btn-cambia-ambito" onClick={() => setAmbitoAttivo(null)}>
              ← Cambia ambito
            </button>
            <ProblemCard
              key={problemaCorrente.id}
              problema={problemaCorrente}
              onCompleto={handleCompleto}
              punteggioAttuale={progress.punteggio}
              nome={nome}
            />
          </>
        ) : (
          <div className="fine-problemi">
            <h2>🏆 Hai completato tutti i problemi di questo ambito, {nome}!</h2>
            <p>Punteggio totale: <strong>{progress.punteggio}</strong> punti</p>
            <button className="btn-avanti" onClick={() => setAmbitoAttivo(null)}>
              Scegli un altro ambito →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
