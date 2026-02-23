import { useState } from 'react';

const OPS = [
  { simbolo: '+', fn: (a, b) => a + b },
  { simbolo: '-', fn: (a, b) => a - b },
  { simbolo: '×', fn: (a, b) => a * b },
  { simbolo: '÷', fn: (a, b) => (b !== 0 ? a / b : null) },
];

export default function CalcolatriceLibera({ risposta, onRisposta, completato }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState(null);
  const [rispostaFinale, setRispostaFinale] = useState('');

  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const pronti = op && !isNaN(numA) && !isNaN(numB);
  const risultato = pronti ? OPS.find((o) => o.simbolo === op)?.fn(numA, numB) : null;

  const verifica = () => {
    const val = parseFloat(rispostaFinale);
    onRisposta(val === risposta);
  };

  return (
    <div className="calcolatrice">
      <div className="calc-display">
        <input
          className="calc-input"
          type="number"
          placeholder="?"
          value={a}
          onChange={(e) => !completato && setA(e.target.value)}
          disabled={completato}
        />
        <span className="calc-op-display">{op ?? '?'}</span>
        <input
          className="calc-input"
          type="number"
          placeholder="?"
          value={b}
          onChange={(e) => !completato && setB(e.target.value)}
          disabled={completato}
        />
        <span className="calc-uguale">=</span>
        <span className="calc-risultato">
          {risultato !== null ? risultato : '?'}
        </span>
      </div>

      <div className="calc-operazioni">
        {OPS.map(({ simbolo }) => (
          <button
            key={simbolo}
            className={`calc-btn ${op === simbolo ? 'calc-btn-attivo' : ''}`}
            onClick={() => !completato && setOp(simbolo)}
            disabled={completato}
          >
            {simbolo}
          </button>
        ))}
      </div>

      {!completato && (
        <div className="calc-risposta-finale">
          <label>La mia risposta è:</label>
          <input
            className="calc-input"
            type="number"
            placeholder="?"
            value={rispostaFinale}
            onChange={(e) => setRispostaFinale(e.target.value)}
          />
          <button
            className="btn-verifica"
            disabled={rispostaFinale === ''}
            onClick={verifica}
          >
            Verifica ✓
          </button>
        </div>
      )}
    </div>
  );
}
