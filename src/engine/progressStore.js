const KEY = 'luca_progress';

const defaultState = () => ({
  completed: {},   // { problemId: { stelle: 1-3, punti: number, data: ISO } }
  punteggio: 0,
  streak: 0,
  badges: [],
});

export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
};

export const saveProgress = (state) =>
  localStorage.setItem(KEY, JSON.stringify(state));

export const resetProgress = () =>
  localStorage.removeItem(KEY);

export const recordResult = (state, problemId, tentativi, puntiBase, problemi = []) => {
  const stelle = tentativi === 1 ? 3 : tentativi === 2 ? 2 : 1;
  const bonusPrimoTentativo = tentativi === 1 ? 5 : 0;
  const nuovoStreak = tentativi === 1 ? state.streak + 1 : 0;
  const bonusStreak = nuovoStreak > 0 && nuovoStreak % 3 === 0 ? 15 : 0;
  const puntiGuadagnati = puntiBase + bonusPrimoTentativo + bonusStreak;

  const nuovoStato = {
    ...state,
    punteggio: state.punteggio + puntiGuadagnati,
    streak: nuovoStreak,
    completed: {
      ...state.completed,
      [problemId]: { stelle, punti: puntiGuadagnati, data: new Date().toISOString() },
    },
  };

  nuovoStato.badges = calcolaBadges(nuovoStato, problemi);
  saveProgress(nuovoStato);
  return { nuovoStato, puntiGuadagnati, stelle, bonusStreak };
};

const BADGES = [
  { id: 'primo_passo',       label: '🌟 Primo Passo',           condizione: (s) => Object.keys(s.completed).length >= 1 },
  { id: 'cinque_problemi',   label: '🎯 5 Problemi risolti',    condizione: (s) => Object.keys(s.completed).length >= 5 },
  { id: 'dieci_problemi',    label: '🏆 10 Problemi risolti',   condizione: (s) => Object.keys(s.completed).length >= 10 },
  { id: 'meta_percorso',     label: '🚀 Metà percorso!',        condizione: (s) => Object.keys(s.completed).length >= 15 },
  { id: 'quasi_esperto',     label: '🔥 Quasi esperto!',        condizione: (s) => Object.keys(s.completed).length >= 22 },
  { id: 'tutti_problemi',    label: '🎓 Percorso completato!',  condizione: (s) => Object.keys(s.completed).length >= 29 },
  { id: 'duecento_punti',    label: '💯 200 Punti',             condizione: (s) => s.punteggio >= 200 },
  { id: 'quattrocento_punti',label: '💎 400 Punti',             condizione: (s) => s.punteggio >= 400 },
  { id: 'tre_stelle_fila',   label: '⭐ 3 risposte perfette',   condizione: (s) => s.streak >= 3 },
  { id: 'sei_stelle_fila',   label: '⭐⭐ 6 risposte perfette',  condizione: (s) => s.streak >= 6 },
  { id: 'scienziato',        label: '🔬 Piccolo Scienziato',    condizione: (s, problemi) => problemi.filter(p => p.categoria === 'scienza' && s.completed[p.id]).length >= 5 },
];

const calcolaBadges = (state, problemi = []) =>
  BADGES.filter((b) => b.condizione(state, problemi)).map((b) => b.id);

export { BADGES };
