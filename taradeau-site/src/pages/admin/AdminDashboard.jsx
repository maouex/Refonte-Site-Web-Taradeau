import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaTicketAlt, FaChartLine } from 'react-icons/fa';
import { useEvents } from '../../context/EventContext';

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      className="admin-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 150 }}
    >
      <div className="admin-stat-icon" style={{ background: color }}>
        <Icon />
      </div>
      <div className="admin-stat-info">
        <span className="admin-stat-value">{value}</span>
        <span className="admin-stat-label">{label}</span>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { events, reservations } = useEvents();

  const totalReservations = reservations.filter((r) => r.statut === 'confirmee').length;
  const totalPersonnes = reservations
    .filter((r) => r.statut === 'confirmee')
    .reduce((sum, r) => sum + (r.nbPersonnes || 1), 0);
  const eventsOuverts = events.filter((e) => e.reservationsOuvertes).length;

  const recentReservations = [...reservations]
    .filter((r) => r.statut === 'confirmee')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de l'activité événementielle</p>
      </div>

      <div className="admin-stats-grid">
        <StatCard
          icon={FaCalendarAlt}
          label="Événements"
          value={events.length}
          color="linear-gradient(135deg, #E84E3B, #d4402e)"
          delay={0}
        />
        <StatCard
          icon={FaTicketAlt}
          label="Réservations"
          value={totalReservations}
          color="linear-gradient(135deg, #C9A84C, #b8963d)"
          delay={0.1}
        />
        <StatCard
          icon={FaUsers}
          label="Personnes inscrites"
          value={totalPersonnes}
          color="linear-gradient(135deg, #1A2B4A, #2a4470)"
          delay={0.2}
        />
        <StatCard
          icon={FaChartLine}
          label="Événements ouverts"
          value={eventsOuverts}
          color="linear-gradient(135deg, #38a169, #2f855a)"
          delay={0.3}
        />
      </div>

      <div className="admin-section">
        <h2>Dernières réservations</h2>
        {recentReservations.length === 0 ? (
          <div className="admin-empty">
            <p>Aucune réservation pour le moment.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Événement</th>
                  <th>Personnes</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.prenom} {r.nom}</strong>
                      <br />
                      <small>{r.email}</small>
                    </td>
                    <td>{r.eventTitre}</td>
                    <td>{r.nbPersonnes}</td>
                    <td>{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`status-badge status-${r.statut}`}>
                        {r.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
