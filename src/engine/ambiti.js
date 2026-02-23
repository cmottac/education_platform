export const AMBITI = [
  { id: 'matematica', label: 'Matematica',  emoji: '🔢', categorie: ['operazioni'] },
  { id: 'scienze',    label: 'Scienze',     emoji: '🔬', categorie: ['scienza'] },
  { id: 'logica',          label: 'Logica',           emoji: '🧠', categorie: ['logica'] },
  { id: 'pensiero-critico', label: 'Pensiero Critico', emoji: '🔍', categorie: ['pensiero-critico'] },
  { id: 'geometria',  label: 'Geometria',   emoji: '📐', categorie: ['geometria'] },
  { id: 'fisica',     label: 'Fisica',      emoji: '⚡', categorie: ['fisica'] },
  { id: 'italiano',   label: 'Italiano',    emoji: '📖', categorie: ['italiano'] },
  { id: 'inglese',    label: 'Inglese',     emoji: '🇬🇧', categorie: ['inglese'] },
];

export const categoriaToAmbito = (categoria) =>
  AMBITI.find((a) => a.categorie.includes(categoria)) ?? AMBITI[0];

export const problemiPerAmbito = (problemi, ambitoId) => {
  const ambito = AMBITI.find((a) => a.id === ambitoId);
  if (!ambito) return [];
  return problemi.filter((p) => ambito.categorie.includes(p.categoria));
};
