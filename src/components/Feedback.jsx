const FRASI_CORRETTE = [
  '🎉 Fantastico, Luca!',
  '🚀 Sei un genio!',
  '⭐ Bravissimo!',
  '🔥 Che forza!',
  '🎯 Perfetto!',
];

const FRASI_SBAGLIATE = [
  '💪 Quasi! Riprova!',
  '🤔 Ci sei quasi, pensa ancora!',
  '👀 Non mollare!',
];

export default function Feedback({ corretto, stelle, puntiGuadagnati, spiegazione, onAvanti, bonusStreak }) {
  const frase = corretto
    ? FRASI_CORRETTE[Math.floor(Math.random() * FRASI_CORRETTE.length)]
    : FRASI_SBAGLIATE[Math.floor(Math.random() * FRASI_SBAGLIATE.length)];

  return (
    <div className={`feedback ${corretto ? 'feedback-ok' : 'feedback-no'}`}>
      <div className="feedback-frase">{frase}</div>
      {corretto && (
        <>
          <div className="stelle">{'⭐'.repeat(stelle)}{'☆'.repeat(3 - stelle)}</div>
          <div className="punti-guadagnati">+{puntiGuadagnati} punti</div>
          {bonusStreak > 0 && <div className="bonus-streak">🔥 Bonus serie: +{bonusStreak}!</div>}
          <div className="spiegazione">{spiegazione}</div>
          <button className="btn-avanti" onClick={onAvanti}>Avanti →</button>
        </>
      )}
    </div>
  );
}
