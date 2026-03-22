import { useLocation } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useContent } from '../context/ContentContext';

function renderContent(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h3 key={i} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ marginTop: '2rem', marginBottom: '0.75rem' }}>{line.slice(2)}</h2>;
    if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.25rem' }}>{line.slice(2)}</li>;
    if (line.trim() === '') return <br key={i} />;
    // Handle **bold** and *italic*
    const processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <p key={i} style={{ margin: '0.35rem 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processed }} />;
  });
}

export default function GenericPage() {
  const location = useLocation();
  const { content } = useContent();
  const pageData = content.pages?.[location.pathname];

  const pathParts = location.pathname.split('/').filter(Boolean);
  const fallbackTitle = pathParts
    .map((p) =>
      p
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(' — ');

  // If page has CMS content and is published
  if (pageData && pageData.publie !== false) {
    return (
      <main id="main-content">
        <div
          style={{
            background: pageData.image
              ? `linear-gradient(rgba(26,43,74,0.85), rgba(26,43,74,0.85)), url(${pageData.image}) center/cover`
              : 'var(--bleu-nuit)',
            padding: '120px 0 60px',
            textAlign: 'center',
          }}
        >
          <div className="container">
            <AnimatedSection>
              <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {pageData.titre}
              </h1>
              {pageData.sousTitre && (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginTop: '0.75rem' }}>
                  {pageData.sousTitre}
                </p>
              )}
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
                  fontSize: '1.05rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.8,
                }}
              >
                {renderContent(pageData.contenu)}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
    );
  }

  // Fallback: page not yet created in CMS
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
              {fallbackTitle || 'Page'}
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
