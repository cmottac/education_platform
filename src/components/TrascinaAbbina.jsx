import { useState } from 'react';

export default function TrascinaAbbina({ elementi, categorie, risposta, onRisposta, completato }) {
  const [abbinamenti, setAbbinamenti] = useState({});
  const [dragging, setDragging] = useState(null);

  const handleDrop = (categoria) => {
    if (!dragging || completato) return;
    setAbbinamenti((prev) => ({ ...prev, [dragging]: categoria }));
    setDragging(null);
  };

  const rimuovi = (elemento) => {
    if (completato) return;
    setAbbinamenti((prev) => { const n = { ...prev }; delete n[elemento]; return n; });
  };

  const tuttiAbbinati = elementi.every((e) => abbinamenti[e]);

  const verifica = () => {
    const ok = elementi.every((e) => abbinamenti[e] === risposta[e]);
    onRisposta(ok, abbinamenti);
  };

  return (
    <div className="trascina-container">
      <div className="trascina-elementi">
        {elementi.filter((e) => !abbinamenti[e]).map((e) => (
          <div
            key={e}
            className="trascina-chip"
            draggable
            onDragStart={() => setDragging(e)}
          >
            {e}
          </div>
        ))}
      </div>

      <div className="trascina-categorie">
        {categorie.map((cat) => (
          <div
            key={cat}
            className="trascina-zona"
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={() => handleDrop(cat)}
          >
            <div className="trascina-zona-label">{cat}</div>
            <div className="trascina-zona-items">
              {elementi.filter((e) => abbinamenti[e] === cat).map((e) => (
                <div
                  key={e}
                  className={`trascina-chip abbinato ${completato ? (risposta[e] === cat ? 'corretta' : 'sbagliata') : ''}`}
                  onClick={() => rimuovi(e)}
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!completato && (
        <button className="btn-verifica" disabled={!tuttiAbbinati} onClick={verifica}>
          Verifica ✓
        </button>
      )}
    </div>
  );
}
