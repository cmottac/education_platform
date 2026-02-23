import { AMBITI, problemiPerAmbito } from '../engine/ambiti';

export default function SceltaAmbito({ nome, problemi, progress, ambitoAttivo, onScelta }) {
  return (
    <div className="scelta-ambito">
      <h2>Ciao {nome}! 👋 Cosa vuoi studiare?</h2>
      <div className="ambiti-grid">
        {AMBITI.map((ambito) => {
          const tot = problemiPerAmbito(problemi, ambito.id);
          const risolti = tot.filter((p) => progress.completed[p.id]).length;
          const completato = tot.length > 0 && risolti === tot.length;
          const attivo = ambitoAttivo === ambito.id;

          return (
            <button
              key={ambito.id}
              className={`ambito-card ${attivo ? 'ambito-attivo' : ''} ${completato ? 'ambito-completato' : ''} ${tot.length === 0 ? 'ambito-vuoto' : ''}`}
              onClick={() => onScelta(ambito.id)}
            >
              <span className="ambito-emoji">{ambito.emoji}</span>
              <span className="ambito-label">{ambito.label}</span>
              {tot.length > 0 && (
                <span className="ambito-progress">{risolti}/{tot.length}</span>
              )}
              {tot.length === 0 && <span className="ambito-presto">Presto!</span>}
              {completato && <span className="ambito-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
