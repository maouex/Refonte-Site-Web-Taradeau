import { FaUserTie } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { communeInfo } from '../data/siteData';

export default function MotDuMaire() {
  const { maire } = communeInfo;

  return (
    <section className="section maire-section" aria-label="Le mot du Maire">
      <div className="container">
        <AnimatedSection>
          <div className="maire-grid">
            <div className="maire-image">
              <div className="maire-image-wrapper">
                <div className="maire-image-placeholder" aria-hidden="true">
                  <FaUserTie />
                </div>
              </div>
              <div className="maire-image-badge">Maire de Taradeau</div>
            </div>
            <div className="maire-content">
              <h2>Le mot du Maire</h2>
              <p className="maire-role">{maire.nom}</p>
              <p className="maire-mandat">Mandat {maire.mandat}</p>
              <blockquote className="maire-quote">
                {maire.citation}
              </blockquote>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
