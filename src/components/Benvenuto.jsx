import { useState } from 'react';

export default function Benvenuto({ onConferma }) {
  const [nome, setNome] = useState('');

  return (
    <div className="benvenuto">
      <div className="benvenuto-card">
        <div className="benvenuto-emoji">🎓</div>
        <h1>Benvenuto!</h1>
        <p>Come ti chiami?</p>
        <input
          className="benvenuto-input"
          type="text"
          placeholder="Il tuo nome..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && nome.trim() && onConferma(nome.trim())}
          autoFocus
        />
        <button
          className="btn-avanti"
          disabled={!nome.trim()}
          onClick={() => onConferma(nome.trim())}
        >
          Inizia l'avventura! →
        </button>
      </div>
    </div>
  );
}
