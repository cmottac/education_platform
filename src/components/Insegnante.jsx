import { useState } from 'react';
import { AMBITI, problemiPerAmbito } from '../engine/ambiti';

export default function Insegnante({ tuttiProblemi, onConferma, onChiudi }) {
  const [ordine, setOrdine] = useState(tuttiProblemi.map((p) => p.id));
  const [attivi, setAttivi] = useState(() => new Set(tuttiProblemi.map((p) => p.id)));
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const problemiOrdinati = ordine.map((id) => tuttiProblemi.find((p) => p.id === id)).filter(Boolean);

  const toggleTutti = (ambitoId, valore) => {
    const ids = problemiPerAmbito(tuttiProblemi, ambitoId).map((p) => p.id);
    setAttivi((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => valore ? next.add(id) : next.delete(id));
      return next;
    });
  };

  const toggleSingolo = (id) => {
    setAttivi((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    setOrdine((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(targetId);
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
    setDragId(null);
    setDragOverId(null);
  };

  const conferma = () => {
    const selezionati = problemiOrdinati.filter((p) => attivi.has(p.id));
    onConferma(selezionati);
  };

  return (
    <div className="insegnante">
      <div className="dashboard-header">
        <h2>👩‍🏫 Pannello Insegnante</h2>
        <button className="btn-chiudi" onClick={onChiudi}>✕ Chiudi</button>
      </div>

      <p className="insegnante-hint">Seleziona i problemi da includere e trascinali per riordinarli. Poi clicca "Avvia Sessione" in basso.</p>

      {AMBITI.map((ambito) => {
        const problemiAmbito = problemiPerAmbito(problemiOrdinati, ambito.id);
        if (problemiAmbito.length === 0) return null;
        const tuttiSelezionati = problemiAmbito.every((p) => attivi.has(p.id));
        const nessuno = problemiAmbito.every((p) => !attivi.has(p.id));

        return (
          <div key={ambito.id} className="insegnante-ambito">
            <div className="insegnante-ambito-header">
              <span>{ambito.emoji} {ambito.label}</span>
              <label className="insegnante-check-tutti">
                <input
                  type="checkbox"
                  checked={tuttiSelezionati}
                  ref={(el) => { if (el) el.indeterminate = !tuttiSelezionati && !nessuno; }}
                  onChange={(e) => toggleTutti(ambito.id, e.target.checked)}
                />
                tutti
              </label>
            </div>

            {problemiAmbito.map((p) => (
              <div
                key={p.id}
                className={`insegnante-riga ${dragOverId === p.id ? 'drag-over' : ''}`}
                draggable
                onDragStart={() => setDragId(p.id)}
                onDragOver={(e) => { e.preventDefault(); setDragOverId(p.id); }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={() => handleDrop(p.id)}
              >
                <span className="drag-handle">⠿</span>
                <input
                  type="checkbox"
                  checked={attivi.has(p.id)}
                  onChange={() => toggleSingolo(p.id)}
                />
                <span className="insegnante-id">#{p.id}</span>
                <span className="insegnante-titolo">{p.titolo}</span>
                <span className="insegnante-tipo">{p.tipo ?? 'scelta-multipla'}</span>
              </div>
            ))}
          </div>
        );
      })}

      <div className="insegnante-footer">
        <span>{attivi.size} problemi selezionati su {tuttiProblemi.length}</span>
        <button className="btn-avanti" disabled={attivi.size === 0} onClick={conferma}>
          Avvia sessione →
        </button>
      </div>
    </div>
  );
}
