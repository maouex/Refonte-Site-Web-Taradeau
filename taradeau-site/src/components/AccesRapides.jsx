import {
  FaCalendarAlt,
  FaFileAlt,
  FaImages,
  FaMapMarkedAlt,
  FaNewspaper,
} from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { accesRapides } from '../data/siteData';

const iconMap = {
  FaCalendarAlt: FaCalendarAlt,
  FaFileAlt: FaFileAlt,
  FaImages: FaImages,
  FaMapMarkedAlt: FaMapMarkedAlt,
  FaNewspaper: FaNewspaper,
};

export default function AccesRapides() {
  return (
    <section className="acces-rapides" aria-label="Accès rapides">
      <div className="container">
        <div className="acces-grid">
          {accesRapides.map((item, i) => {
            const Icon = iconMap[item.icone];
            return (
              <AnimatedSection key={item.titre} delay={i * 0.1}>
                <div className="acces-card" role="button" tabIndex={0}>
                  <div className="acces-card-icon" aria-hidden="true">
                    {Icon && <Icon />}
                  </div>
                  <h3>{item.titre}</h3>
                  <p>{item.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
