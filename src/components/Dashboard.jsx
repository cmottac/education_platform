import { BADGES } from '../engine/progressStore';

export default function Dashboard({ progress, problemi, nome, onReset, onChiudi }) {
  const completati = Object.entries(progress.completed);
  const perCategoria = {};
  completati.forEach(([id]) => {
    const p = problemi.find((pr) => String(pr.id) === String(id));
    if (p) perCategoria[p.categoria] = (perCategoria[p.categoria] || 0) + 1;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard di {nome}</h2>
        <button className="btn-chiudi" onClick={onChiudi}>✕ Chiudi</button>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-num">{progress.punteggio}</div>
          <div className="stat-label">Punti totali</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{completati.length}</div>
          <div className="stat-label">Problemi risolti</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{progress.streak}</div>
          <div className="stat-label">Serie attuale 🔥</div>
        </div>
      </div>

      <h3>Badge sbloccati</h3>
      <div className="badges-grid">
        {BADGES.map((b) => (
          <div key={b.id} className={`badge ${progress.badges.includes(b.id) ? 'badge-attivo' : 'badge-inattivo'}`}>
            {b.label}
          </div>
        ))}
      </div>

      <h3>Progressi per categoria</h3>
      <div className="categorie-grid">
        {Object.entries(perCategoria).map(([cat, n]) => (
          <div key={cat} className="categoria-row">
            <span>{cat}</span>
            <span>{n} risolti</span>
          </div>
        ))}
      </div>

      <h3>Dettaglio problemi</h3>
      <table className="tabella-problemi">
        <thead>
          <tr><th>Problema</th><th>Stelle</th><th>Punti</th><th>Data</th></tr>
        </thead>
        <tbody>
          {completati.map(([id, dati]) => {
            const p = problemi.find((pr) => String(pr.id) === String(id));
            return (
              <tr key={id}>
                <td>{p?.titolo || id}</td>
                <td>{'⭐'.repeat(dati.stelle)}</td>
                <td>{dati.punti}</td>
                <td>{new Date(dati.data).toLocaleDateString('it-IT')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="btn-reset" onClick={onReset}>🗑️ Reset progressi</button>
    </div>
  );
}
