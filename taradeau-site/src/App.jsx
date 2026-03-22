import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NewsProvider } from './context/NewsContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ContentProvider } from './context/ContentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/CursorGlow';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import SEOHead from './components/SEOHead';
import PageViewTracker from './components/PageViewTracker';

// Lazy-loaded pages for performance
const GenericPage = lazy(() => import('./pages/GenericPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminReservations = lazy(() => import('./pages/admin/AdminReservations'));
const AdminActualites = lazy(() => import('./pages/admin/AdminActualites'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));
const AdminImages = lazy(() => import('./pages/admin/AdminImages'));
const AdminContenu = lazy(() => import('./pages/admin/AdminContenu'));
const AdminPages = lazy(() => import('./pages/admin/AdminPages'));
const AdminParametres = lazy(() => import('./pages/admin/AdminParametres'));

function LazyFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-body)',
    }}>
      Chargement...
    </div>
  );
}

function PublicRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <SEOHead />
      <PageViewTracker />
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
                <Suspense fallback={<LazyFallback />}>
                  <GenericPage />
                </Suspense>
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
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="evenements" element={<AdminEvents />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="actualites" element={<AdminActualites />} />
            <Route path="statistiques" element={<AdminStats />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="contenu" element={<AdminContenu />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="parametres" element={<AdminParametres />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContentProvider>
          <EventProvider>
            <NewsProvider>
              <LanguageProvider>
                <AnalyticsProvider>
                  <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <Preloader />
                    <ScrollToTop />
                    <AppRoutes />
                  </BrowserRouter>
                </AnalyticsProvider>
              </LanguageProvider>
            </NewsProvider>
          </EventProvider>
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
