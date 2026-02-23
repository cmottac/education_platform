import { useState } from 'react';

export default function FormaGruppi({ oggettoEmoji, totale, gruppi, onRisposta, completato }) {
  // items: array of { id, gruppoId | null }
  const [items, setItems] = useState(() =>
    Array.from({ length: totale }, (_, i) => ({ id: i, gruppoId: null }))
  );
  const [dragId, setDragId] = useState(null);

  const assegna = (gruppoId) => {
    if (dragId === null || completato) return;
    setItems((prev) => prev.map((it) => it.id === dragId ? { ...it, gruppoId } : it));
    setDragId(null);
  };

  const rimuovi = (id) => {
    if (completato) return;
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, gruppoId: null } : it));
  };

  const nonAssegnati = items.filter((it) => it.gruppoId === null);
  const tuttiAssegnati = nonAssegnati.length === 0;

  const verifica = () => {
    const attesi = totale / gruppi;
    const ok = Array.from({ length: gruppi }, (_, g) =>
      items.filter((it) => it.gruppoId === g).length
    ).every((n) => n === attesi);
    onRisposta(ok);
  };

  return (
    <div className="gruppi-container">
      {/* Serbatoio oggetti */}
      <div className="gruppi-serbatoio">
        {nonAssegnati.map((it) => (
          <span
            key={it.id}
            className="gruppi-item"
            draggable
            onDragStart={() => setDragId(it.id)}
          >
            {oggettoEmoji}
          </span>
        ))}
      </div>

      {/* Cesti/gruppi */}
      <div className="gruppi-cesti">
        {Array.from({ length: gruppi }, (_, g) => {
          const contenuto = items.filter((it) => it.gruppoId === g);
          return (
            <div
              key={g}
              className={`gruppi-cesto ${completato ? (contenuto.length === totale / gruppi ? 'cesto-ok' : 'cesto-no') : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => assegna(g)}
            >
              <div className="cesto-label">Gruppo {g + 1}</div>
              <div className="cesto-items">
                {contenuto.map((it) => (
                  <span
                    key={it.id}
                    className="gruppi-item"
                    onClick={() => rimuovi(it.id)}
                    title="Clicca per togliere"
                  >
                    {oggettoEmoji}
                  </span>
                ))}
              </div>
              <div className="cesto-count">{contenuto.length}</div>
            </div>
          );
        })}
      </div>

      {!completato && (
        <button className="btn-verifica" disabled={!tuttiAssegnati} onClick={verifica}>
          Verifica ✓
        </button>
      )}
    </div>
  );
}
