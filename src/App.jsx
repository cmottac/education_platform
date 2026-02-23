import { useState, useCallback } from 'react';
import { loadProblems } from './engine/problemLoader';
import { loadProgress, recordResult, resetProgress, saveNome, BADGES } from './engine/progressStore';
import { problemiPerAmbito } from './engine/ambiti';
import ProblemCard from './components/ProblemCard';
import Dashboard from './components/Dashboard';
import Benvenuto from './components/Benvenuto';
import SceltaAmbito from './components/SceltaAmbito';
import './styles/app.css';

const tuttiProblemi = loadProblems();

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [ambitoAttivo, setAmbitoAttivo] = useState(null);
  const [dashboardAperta, setDashboardAperta] = useState(false);
  const [nuoviBadge, setNuoviBadge] = useState([]);

  const nome = progress.nome;

  const problemiFiltrati = ambitoAttivo
    ? problemiPerAmbito(tuttiProblemi, ambitoAttivo)
    : [];

  const [problemaCorrenteId, setProblemaCorrenteId] = useState(null);

  const problemaCorrente = (() => {
    if (!ambitoAttivo) return null;
    // Se c'è un problema in corso (non ancora avanzato), tienilo
    if (problemaCorrenteId) {
      const p = problemiFiltrati.find((p) => p.id === problemaCorrenteId);
      if (p) return p;
    }
    // Altrimenti trova il primo non completato
    return problemiFiltrati.find((p) => !progress.completed[p.id]) ?? null;
  })();

  const handleNome = (n) => {
    const nuovoStato = saveNome(n);
    setProgress(nuovoStato);
  };

  const handleAmbitoScelta = (ambitoId) => { setAmbitoAttivo(ambitoId); setProblemaCorrenteId(null); };

  const handleCompleto = useCallback((id, tentativi, puntiBase, avanza) => {
    if (avanza) {
      setProblemaCorrenteId(null); // libera il lock, trova il prossimo
      setNuoviBadge([]);
      return;
    }
    const { nuovoStato, puntiGuadagnati, stelle, bonusStreak } = recordResult(progress, id, tentativi, puntiBase, tuttiProblemi);
    const badgeNuovi = nuovoStato.badges.filter((b) => !progress.badges.includes(b));
    setProblemaCorrenteId(id); // blocca il problema corrente finché non si preme Avanti
    setProgress(nuovoStato);
    setNuoviBadge(badgeNuovi);
    return { puntiGuadagnati, stelle, bonusStreak };
  }, [progress]);

  const handleReset = () => {
    resetProgress();
    setProgress(loadProgress());
    setAmbitoAttivo(null);
    setDashboardAperta(false);
  };

  // Schermata nome
  if (!nome) return <Benvenuto onConferma={handleNome} />;

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🎓 Ciao {nome}!</span>
        <div className="header-actions">
          <span className="punteggio-header">⭐ {progress.punteggio} punti</span>
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
