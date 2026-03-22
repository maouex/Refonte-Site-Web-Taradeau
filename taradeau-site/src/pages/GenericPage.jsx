import { useLocation } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

export default function GenericPage() {
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts
    .map((p) =>
      p
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(' — ');

  return (
    <main id="main-content">
      <div
        style={{
          background: 'var(--gris-bleute)',
          padding: '120px 0 60px',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <AnimatedSection>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {title || 'Page'}
            </h1>
          </AnimatedSection>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 16,
                padding: '48px 40px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                Cette page est en cours de construction. Revenez bientôt pour découvrir
                tout le contenu !
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
