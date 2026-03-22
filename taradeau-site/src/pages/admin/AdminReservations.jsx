import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';
import { useEvents } from '../../context/EventContext';

export default function AdminReservations() {
  const { events, reservations, cancelReservation, deleteReservation } = useEvents();
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');

  const filtered = useMemo(() => {
    return reservations
      .filter((r) => {
        if (filterEvent !== 'all' && r.eventId !== filterEvent) return false;
        if (filterStatut !== 'all' && r.statut !== filterStatut) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            r.nom.toLowerCase().includes(q) ||
            r.prenom.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.telephone.includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reservations, search, filterEvent, filterStatut]);

  const exportCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Événement', 'Personnes', 'Date', 'Statut'];
    const rows = filtered.map((r) => [
      r.nom, r.prenom, r.email, r.telephone, r.eventTitre,
      r.nbPersonnes, new Date(r.date).toLocaleDateString('fr-FR'), r.statut,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-taradeau-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reservations">
      <div className="admin-page-header">
        <div>
          <h1>Réservations</h1>
          <p>{filtered.length} réservation{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>
          <FaDownload /> Exporter CSV
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="admin-search-clear">
              <FaTimes />
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <FaFilter />
          <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
            <option value="all">Tous les événements</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.titre}</option>
            ))}
          </select>

          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="confirmee">Confirmée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p>Aucune réservation trouvée.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Contact</th>
                <th>Événement</th>
                <th>Personnes</th>
                <th>Date résa</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                >
                  <td>
                    <strong>{r.prenom} {r.nom}</strong>
                  </td>
                  <td>
                    <div>{r.email}</div>
                    <small>{r.telephone}</small>
                  </td>
                  <td>{r.eventTitre}</td>
                  <td className="text-center">{r.nbPersonnes}</td>
                  <td>{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`status-badge status-${r.statut}`}>
                      {r.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      {r.statut === 'confirmee' && (
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => cancelReservation(r.id)}
                          title="Annuler"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        className="btn btn-xs btn-danger-outline"
                        onClick={() => deleteReservation(r.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
