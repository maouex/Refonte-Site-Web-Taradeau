import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import GenericPage from './pages/GenericPage';
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/CursorGlow';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminReservations from './pages/admin/AdminReservations';

function PublicRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <GenericPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="evenements" element={<AdminEvents />} />
          <Route path="reservations" element={<AdminReservations />} />
        </Route>
      </Routes>
    );
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <Preloader />
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
