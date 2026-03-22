import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import AnimatedSection, { StaggerItem } from './AnimatedSection';
import { sitesRemarquables } from '../data/siteData';

const gradients = [
  'linear-gradient(135deg, #1A2B4A 0%, #E84E3B 100%)',
  'linear-gradient(135deg, #2a4470 0%, #C9A84C 100%)',
  'linear-gradient(135deg, #E84E3B 0%, #1A2B4A 100%)',
];

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

        <AnimatedSection stagger className="sites-grid">
          {sitesRemarquables.map((site, i) => (
            <StaggerItem key={site.titre} variant="scale">
              <motion.div
                className="site-card"
                role="article"
                whileHover="hover"
              >
                <motion.div
                  className="site-card-bg"
                  style={{ background: gradients[i] }}
                  aria-hidden="true"
                  variants={{
                    hover: { scale: 1.1, rotate: 2 },
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <div className="site-card-overlay" aria-hidden="true" />
                <div className="site-card-content">
                  <motion.h3
                    variants={{ hover: { y: -8 } }}
                    transition={{ duration: 0.3 }}
                  >
                    {site.titre}
                  </motion.h3>
                  <motion.p
                    variants={{ hover: { opacity: 1, y: 0 } }}
                    initial={{ opacity: 0.7, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {site.description}
                  </motion.p>
                  <motion.span
                    className="site-card-cta"
                    variants={{ hover: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    Découvrir <FaArrowRight />
                  </motion.span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
