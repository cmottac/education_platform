import { useState } from 'react';

export default function Bilancia({ pesoSinistro, pesiDisponibili, onRisposta, completato, impossibile }) {
  const [destro, setDestro] = useState([]);
  const [dragPeso, setDragPeso] = useState(null);

  const sommaDestro = destro.reduce((a, b) => a + b, 0);
  const differenza = sommaDestro - pesoSinistro;
  // tilt: negativo = sinistra pesa di più, positivo = destra pesa di più
  const tilt = Math.max(-20, Math.min(20, differenza * 3));

  const aggiungi = (peso) => {
    if (completato) return;
    setDestro((prev) => [...prev, peso]);
  };

  const rimuovi = (idx) => {
    if (completato) return;
    setDestro((prev) => prev.filter((_, i) => i !== idx));
  };

  const verifica = () => {
    if (impossibile) { onRisposta(false); return; }
    onRisposta(sommaDestro === pesoSinistro);
  };

  return (
    <div className="bilancia-container">
      {/* Visualizzazione bilancia */}
      <div className="bilancia-visual">
        <div className="bilancia-asta" style={{ transform: `rotate(${tilt}deg)` }}>
          <div className="bilancia-piatto piatto-sx">
            <div className="piatto-peso">{pesoSinistro} kg</div>
            <div className="piatto-disco">⚖️</div>
          </div>
          <div className="bilancia-centro">▲</div>
          <div className="bilancia-piatto piatto-dx">
            <div className="piatto-pesi">
              {destro.map((p, i) => (
                <span key={i} className="peso-sul-piatto" onClick={() => rimuovi(i)} title="Clicca per togliere">
                  {p}
                </span>
              ))}
            </div>
            <div className="piatto-somma">{sommaDestro > 0 ? `${sommaDestro} kg` : ''}</div>
          </div>
        </div>
        <div className="bilancia-base">╨</div>
      </div>

      {/* Stato */}
      <div className={`bilancia-stato ${differenza === 0 ? 'stato-ok' : differenza > 0 ? 'stato-troppo' : 'stato-poco'}`}>
        {differenza === 0 && sommaDestro > 0 ? '⚖️ In equilibrio!' : differenza > 0 ? `Troppo pesante di ${differenza} kg` : differenza < 0 ? `Mancano ${-differenza} kg` : 'Trascina i pesi sul piatto destro'}
      </div>

      {/* Pesi disponibili */}
      <div className="pesi-disponibili">
        {pesiDisponibili.map((p, i) => (
          <div
            key={i}
            className="peso-chip"
            draggable
            onDragStart={() => setDragPeso(p)}
            onClick={() => aggiungi(p)}
          >
            {p} kg
          </div>
        ))}
      </div>

      {/* Zona drop */}
      <div
        className="bilancia-drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => { if (dragPeso !== null) { aggiungi(dragPeso); setDragPeso(null); } }}
      >
        Trascina qui i pesi ↑ oppure clicca su di essi
      </div>

      {!completato && (
        <div className="bilancia-azioni">
          <button className="btn-verifica" disabled={sommaDestro === 0} onClick={verifica}>
            Verifica ✓
          </button>
          {impossibile && (
            <button className="btn-impossibile" onClick={() => onRisposta(true)}>
              🚫 È impossibile!
            </button>
          )}
        </div>
      )}
    </div>
  );
}
