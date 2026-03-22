import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaBars, FaTimes, FaSun, FaMoon, FaChevronDown, FaLandmark, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { content } = useContent();
  const communeInfo = content.communeInfo;
  const navigation = content.navigation;
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <div className="top-bar" role="banner">
        <div className="container">
          <div className="top-bar-left">
            <a href={`tel:${communeInfo.telephone.replace(/\s/g, '')}`}>
              <FaPhone style={{ marginRight: 6 }} />
              {communeInfo.telephone}
            </a>
            <a href={`mailto:${communeInfo.email}`}>
              <FaEnvelope style={{ marginRight: 6 }} />
              {communeInfo.email}
            </a>
          </div>
          <div className="top-bar-right">
            <Link to="/manifestations/evenements">Actualités</Link>
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`} role="navigation">
        <div className="container">
          <Link to="/" className="logo" aria-label="Mairie de Taradeau - Accueil">
            <div className="logo-icon">
              <FaLandmark />
            </div>
            Taradeau
          </Link>

          <nav className="nav-desktop" aria-label="Navigation principale">
            {navigation.map((item) => (
              <div key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                  {item.sous && <FaChevronDown style={{ fontSize: '0.65rem' }} />}
                </Link>
                {item.sous && (
                  <div className="nav-dropdown">
                    {item.sous.map((sub) => (
                      <Link key={sub.path} to={sub.path}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
              title={language === 'fr' ? 'English' : 'Français'}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600 }}
            >
              <FaGlobe /> {language === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              className="theme-toggle"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu de navigation">
        <button className="nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
          <FaTimes />
        </button>
        <nav aria-label="Navigation mobile">
          {navigation.map((item) => (
            <div key={item.path}>
              <Link to={item.path}>{item.label}</Link>
              {item.sous?.map((sub) => (
                <Link key={sub.path} to={sub.path} className="sub-link">
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
