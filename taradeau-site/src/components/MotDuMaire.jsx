import { motion } from 'framer-motion';
import { FaUserTie, FaQuoteLeft } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { communeInfo } from '../data/siteData';

export default function MotDuMaire() {
  const { maire } = communeInfo;

  return (
    <section className="section maire-section" aria-label="Le mot du Maire">
      <div className="container">
        <div className="maire-grid">
          <AnimatedSection variant="left">
            <div className="maire-image">
              <div className="maire-image-wrapper">
                <div className="maire-image-placeholder" aria-hidden="true">
                  <FaUserTie />
                </div>
                <div className="maire-image-glow" aria-hidden="true" />
              </div>
              <motion.div
                className="maire-image-badge"
                whileHover={{ scale: 1.05 }}
              >
                Maire de Taradeau
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="right" delay={0.2}>
            <div className="maire-content">
              <h2>Le mot du Maire</h2>
              <p className="maire-role">{maire.nom}</p>
              <p className="maire-mandat">Mandat {maire.mandat}</p>
              <blockquote className="maire-quote">
                <FaQuoteLeft className="maire-quote-icon" aria-hidden="true" />
                {maire.citation}
              </blockquote>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
