import AnimatedSection from './AnimatedSection';
import { sitesRemarquables } from '../data/siteData';

export default function SitesRemarquables() {
  return (
    <section className="section sites-section" aria-label="Sites remarquables">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Sites remarquables</h2>
            <p>Découvrez le patrimoine exceptionnel de Taradeau</p>
          </div>
        </AnimatedSection>

        <div className="sites-grid">
          {sitesRemarquables.map((site, i) => (
            <AnimatedSection key={site.titre} delay={i * 0.15}>
              <div className="site-card" role="article">
                <div className="site-card-bg" aria-hidden="true" />
                <div className="site-card-overlay" aria-hidden="true" />
                <div className="site-card-content">
                  <h3>{site.titre}</h3>
                  <p>{site.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
