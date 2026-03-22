import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaEye, FaCalendarDay, FaArrowUp } from 'react-icons/fa';
import { useAnalytics } from '../../context/AnalyticsContext';

const cardStyle = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.10)',
  padding: '1.5rem',
};

const statIconStyle = (color) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  color: '#fff',
  background: color,
  flexShrink: 0,
});

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      style={{
        ...cardStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 150 }}
    >
      <div style={statIconStyle(color)}>
        <Icon />
      </div>
      <div>
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--texte-principal)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--texte-secondaire, #8a8a9a)',
            marginTop: 2,
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function BarChart({ data }) {
  const maxVal = Math.max(...Object.values(data), 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: 180,
        padding: '0.5rem 0',
      }}
    >
      {Object.entries(data).map(([day, count]) => {
        const heightPct = (count / maxVal) * 100;
        const dayLabel = new Date(day + 'T00:00:00').toLocaleDateString(
          'fr-FR',
          { weekday: 'short', day: 'numeric' }
        );
        return (
          <div
            key={day}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--texte-principal)',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {count}
            </span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(heightPct, 2)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: 40,
                borderRadius: '6px 6px 2px 2px',
                background: 'var(--rouge-provencal, #E84E3B)',
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--texte-secondaire, #8a8a9a)',
                marginTop: 6,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminStats() {
  const { getStats } = useAnalytics();
  const stats = useMemo(() => getStats(), [getStats]);

  const { totalViews, viewsByDay, topPages, events } = stats;

  // Visits today
  const todayKey = new Date().toISOString().slice(0, 10);
  const visitsToday = viewsByDay[todayKey] || 0;

  // Most visited page
  const mostVisited = topPages.length > 0 ? topPages[0].path : '-';

  // Unique pages count
  const uniquePages = topPages.length;

  // Last 7 days for chart
  const last7 = Object.fromEntries(
    Object.entries(viewsByDay).slice(-7)
  );

  // Recent events (last 20)
  const recentEvents = [...events].reverse().slice(0, 20);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Statistiques du site
        </motion.h1>
        <p>Analyse des visites et interactions</p>
      </div>

      {/* Summary cards */}
      <div className="admin-stats-grid">
        <StatCard
          icon={FaEye}
          label="Visites totales"
          value={totalViews}
          color="linear-gradient(135deg, #E84E3B, #d4402e)"
          delay={0}
        />
        <StatCard
          icon={FaCalendarDay}
          label="Visites aujourd'hui"
          value={visitsToday}
          color="linear-gradient(135deg, #C9A84C, #b8963d)"
          delay={0.1}
        />
        <StatCard
          icon={FaArrowUp}
          label="Page la plus visitée"
          value={mostVisited}
          color="linear-gradient(135deg, #1A2B4A, #2a4470)"
          delay={0.2}
        />
        <StatCard
          icon={FaChartBar}
          label="Pages uniques"
          value={uniquePages}
          color="linear-gradient(135deg, #38a169, #2f855a)"
          delay={0.3}
        />
      </div>

      {/* Bar chart - last 7 days */}
      <motion.div
        className="admin-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2>Visites des 7 derniers jours</h2>
        <div style={cardStyle}>
          <BarChart data={last7} />
        </div>
      </motion.div>

      {/* Pages table */}
      <motion.div
        className="admin-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Pages par nombre de visites</h2>
        {topPages.length === 0 ? (
          <div className="admin-empty">
            <p>Aucune donnée de visite enregistrée.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Page</th>
                  <th>Visites</th>
                  <th>Part</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr key={page.path}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>{page.path}</strong>
                    </td>
                    <td>{page.count}</td>
                    <td>
                      {totalViews > 0
                        ? `${((page.count / totalViews) * 100).toFixed(1)}%`
                        : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Recent activity */}
      <motion.div
        className="admin-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2>Activité récente</h2>
        {recentEvents.length === 0 ? (
          <div className="admin-empty">
            <p>Aucune activité enregistrée.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {recentEvents.map((evt, i) => (
              <motion.div
                key={`${evt.timestamp}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                style={{
                  ...cardStyle,
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      background:
                        evt.type === 'click'
                          ? 'var(--rouge-provencal, #E84E3B)'
                          : evt.type === 'section_view'
                          ? 'var(--or-provencal, #C9A84C)'
                          : 'var(--bleu-nuit, #1A2B4A)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                    }}
                  >
                    {evt.type === 'click'
                      ? 'Clic'
                      : evt.type === 'section_view'
                      ? 'Section'
                      : evt.type}
                  </span>
                  <span
                    style={{
                      color: 'var(--texte-principal)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {evt.label}
                  </span>
                </div>
                <span
                  style={{
                    color: 'var(--texte-secondaire, #8a8a9a)',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {new Date(evt.timestamp).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
