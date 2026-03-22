import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaTicketAlt, FaSignOutAlt, FaLandmark, FaHome, FaNewspaper, FaChartBar, FaImages } from 'react-icons/fa';
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
