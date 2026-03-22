import {
  FaFileSignature,
  FaBuilding,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaTint,
  FaGavel,
} from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { services } from '../data/siteData';

const iconMap = {
  FaFileSignature: FaFileSignature,
  FaBuilding: FaBuilding,
  FaHandHoldingHeart: FaHandHoldingHeart,
  FaShieldAlt: FaShieldAlt,
  FaTint: FaTint,
  FaGavel: FaGavel,
};

export default function Services() {
  return (
    <section className="section services-section" aria-label="Services municipaux">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Services municipaux</h2>
            <p>À votre service au quotidien</p>
          </div>
        </AnimatedSection>

        <div className="services-grid">
          {services.map((service, i) => {
            const Icon = iconMap[service.icone];
            return (
              <AnimatedSection key={service.titre} delay={i * 0.1}>
                <div className="service-card">
                  <div className="service-icon" aria-hidden="true">
                    {Icon && <Icon />}
                  </div>
                  <h3>{service.titre}</h3>
                  <p>{service.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
