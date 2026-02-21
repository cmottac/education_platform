export default function ChoiceButtons({ scelte, onRisposta, disabilitati, selezionato, corretta }) {
  return (
    <div className="choices">
      {scelte.map((scelta) => {
        let cls = 'choice-btn';
        if (disabilitati) {
          if (scelta === corretta) cls += ' corretta';
          else if (scelta === selezionato) cls += ' sbagliata';
        }
        return (
          <button
            key={scelta}
            className={cls}
            onClick={() => !disabilitati && onRisposta(scelta)}
            disabled={disabilitati}
          >
            {scelta}
          </button>
        );
      })}
    </div>
  );
}
