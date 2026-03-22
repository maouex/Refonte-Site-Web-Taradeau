import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaTicketAlt, FaSignOutAlt, FaLandmark, FaHome, FaNewspaper, FaChartBar, FaImages, FaPencilAlt, FaFile, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <FaLandmark />
          </div>
          <div>
            <h2>Admin</h2>
            <p>Mairie de Taradeau</p>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaChartLine /> Tableau de bord
          </NavLink>
          <NavLink to="/admin/evenements" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaCalendarAlt /> Événements
          </NavLink>
          <NavLink to="/admin/reservations" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaTicketAlt /> Réservations
          </NavLink>
          <NavLink to="/admin/actualites" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaNewspaper /> Actualités
          </NavLink>
          <NavLink to="/admin/images" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaImages /> Images
          </NavLink>

          <div style={{ margin: '0.75rem 0 0.25rem', padding: '0 0.75rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', opacity: 0.6 }}>
            CMS
          </div>
          <NavLink to="/admin/contenu" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaPencilAlt /> Contenu du site
          </NavLink>
          <NavLink to="/admin/pages" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaFile /> Pages
          </NavLink>
          <NavLink to="/admin/parametres" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaCog /> Paramètres
          </NavLink>

          <div style={{ margin: '0.75rem 0 0.25rem', padding: '0 0.75rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', opacity: 0.6 }}>
            Analyse
          </div>
          <NavLink to="/admin/statistiques" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FaChartBar /> Statistiques
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link">
            <FaHome /> Retour au site
          </NavLink>
          <button className="admin-nav-link admin-logout" onClick={logout}>
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
