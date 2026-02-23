import { useState } from 'react';

const OPERAZIONI = [
  { simbolo: '+', fn: (a, b) => a + b },
  { simbolo: '-', fn: (a, b) => a - b },
  { simbolo: '×', fn: (a, b) => a * b },
  { simbolo: '÷', fn: (a, b) => (b !== 0 ? a / b : '?') },
];

export default function Calcolatrice({ numeri, operazioneCorretta, onRisposta, completato }) {
  const [opScelta, setOpScelta] = useState(null);
  const [a, b] = numeri;

  const risultato = opScelta
    ? OPERAZIONI.find((o) => o.simbolo === opScelta)?.fn(a, b)
    : null;

  const verifica = () => onRisposta(opScelta === operazioneCorretta);

  return (
    <div className="calcolatrice">
      <div className="calc-display">
        <span className="calc-numero">{a}</span>
        <span className="calc-op-display">{opScelta ?? '?'}</span>
        <span className="calc-numero">{b}</span>
        <span className="calc-uguale">=</span>
        <span className="calc-risultato">{risultato !== null ? risultato : '?'}</span>
      </div>

      <div className="calc-operazioni">
        {OPERAZIONI.map(({ simbolo }) => (
          <button
            key={simbolo}
            className={`calc-btn ${opScelta === simbolo ? 'calc-btn-attivo' : ''} ${completato ? (simbolo === operazioneCorretta ? 'corretta' : opScelta === simbolo ? 'sbagliata' : '') : ''}`}
            onClick={() => !completato && setOpScelta(simbolo)}
            disabled={completato}
          >
            {simbolo}
          </button>
        ))}
      </div>

      {!completato && (
        <button className="btn-verifica" disabled={!opScelta} onClick={verifica}>
          Verifica ✓
        </button>
      )}
    </div>
  );
}
