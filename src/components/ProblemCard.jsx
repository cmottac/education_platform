import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import ChoiceButtons from './ChoiceButtons';
import TrascinaAbbina from './TrascinaAbbina';
import Feedback from './Feedback';

const CATEGORIA_EMOJI = {
  addizione: '➕',
  sottrazione: '➖',
  moltiplicazione: '✖️',
  divisione: '➗',
  logica: '🧠',
  geometria: '📐',
  scienza: '🔬',
};

export default function ProblemCard({ problema, onCompleto, punteggioAttuale }) {
  const [tentativi, setTentativi] = useState(0);
  const [selezionato, setSelezionato] = useState(null);
  const [corretto, setCorretto] = useState(null);
  const [risultato, setRisultato] = useState(null);

  const tipo = problema.tipo ?? 'scelta-multipla';

  const registraRisultato = (ok, nuoviTentativi, scelta) => {
    setSelezionato(scelta);
    setCorretto(ok);
    if (ok) {
      const res = onCompleto(problema.id, nuoviTentativi, problema.punti, false);
      setRisultato(res ?? {});
    } else {
      setRisultato({});
    }
  };

  const handleSceltaMultipla = (scelta) => {
    const ok = String(scelta) === String(problema.risposta);
    const nuoviTentativi = tentativi + 1;
    setTentativi(nuoviTentativi);
    registraRisultato(ok, nuoviTentativi, scelta);
  };

  const handleTrascina = (ok) => {
    const nuoviTentativi = tentativi + 1;
    setTentativi(nuoviTentativi);
    registraRisultato(ok, nuoviTentativi, ok);
  };

  const handleAvanti = () => onCompleto(problema.id, tentativi, problema.punti, true);

  return (
    <div className="problem-card">
      <div className="problem-header">
        <span className="categoria-badge">
          {CATEGORIA_EMOJI[problema.categoria] || '📚'} {problema.categoria}
        </span>
        <span className="punteggio-header">⭐ {punteggioAttuale} punti</span>
      </div>

      <h2 className="problem-titolo">{problema.titolo}</h2>

      <div className="problem-body">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {problema.body}
        </ReactMarkdown>
      </div>

      {tipo === 'scelta-multipla' && (
        <ChoiceButtons
          scelte={problema.scelte}
          onRisposta={handleSceltaMultipla}
          disabilitati={corretto === true}
          selezionato={selezionato}
          corretta={problema.risposta}
        />
      )}

      {tipo === 'trascina-abbina' && (
        <TrascinaAbbina
          elementi={problema.elementi}
          categorie={problema.categorie}
          risposta={problema.risposta}
          onRisposta={handleTrascina}
          completato={corretto === true}
        />
      )}

      {corretto !== null && (
        <Feedback
          corretto={corretto}
          stelle={risultato?.stelle}
          puntiGuadagnati={risultato?.puntiGuadagnati}
          spiegazione={problema.spiegazione}
          onAvanti={handleAvanti}
          bonusStreak={risultato?.bonusStreak}
        />
      )}
    </div>
  );
}
