import { AMBITI } from './ambiti';

const KEY = 'edu_progress';

const defaultState = () => ({
  nome: null,
  completed: {},
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

export const saveNome = (nome) => {
  const state = loadProgress();
  const nuovoStato = { ...state, nome };
  saveProgress(nuovoStato);
  return nuovoStato;
};

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

const BADGES_STATICI = [
  { id: 'primo_passo',        label: '🌟 Primo Passo',          condizione: (s) => Object.keys(s.completed).length >= 1 },
  { id: 'cinque_problemi',    label: '🎯 5 Problemi risolti',   condizione: (s) => Object.keys(s.completed).length >= 5 },
  { id: 'dieci_problemi',     label: '🏆 10 Problemi risolti',  condizione: (s) => Object.keys(s.completed).length >= 10 },
  { id: 'meta_percorso',      label: '🚀 Metà percorso!',       condizione: (s) => Object.keys(s.completed).length >= 15 },
  { id: 'quasi_esperto',      label: '🔥 Quasi esperto!',       condizione: (s) => Object.keys(s.completed).length >= 22 },
  { id: 'duecento_punti',     label: '💯 200 Punti',            condizione: (s) => s.punteggio >= 200 },
  { id: 'quattrocento_punti', label: '💎 400 Punti',            condizione: (s) => s.punteggio >= 400 },
  { id: 'tre_stelle_fila',    label: '⭐ 3 risposte perfette',  condizione: (s) => s.streak >= 3 },
  { id: 'sei_stelle_fila',    label: '⭐⭐ 6 risposte perfette', condizione: (s) => s.streak >= 6 },
];

const BADGES_AMBITO = AMBITI.map((a) => ({
  id: `ambito_${a.id}`,
  label: `${a.emoji} ${a.label} completata!`,
  condizione: (s, problemi) => {
    const tot = problemi.filter((p) => a.categorie.includes(p.categoria));
    return tot.length > 0 && tot.every((p) => s.completed[p.id]);
  },
}));

export const BADGES = [...BADGES_STATICI, ...BADGES_AMBITO];

const calcolaBadges = (state, problemi = []) =>
  BADGES.filter((b) => b.condizione(state, problemi)).map((b) => b.id);
