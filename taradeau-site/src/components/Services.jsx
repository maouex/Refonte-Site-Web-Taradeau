import { motion } from 'framer-motion';
import {
  FaFileSignature,
  FaBuilding,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaTint,
  FaGavel,
  FaArrowRight,
} from 'react-icons/fa';
import AnimatedSection, { StaggerItem } from './AnimatedSection';
import { useContent } from '../context/ContentContext';

const iconMap = {
  FaFileSignature: FaFileSignature,
  FaBuilding: FaBuilding,
  FaHandHoldingHeart: FaHandHoldingHeart,
  FaShieldAlt: FaShieldAlt,
  FaTint: FaTint,
  FaGavel: FaGavel,
};

export default function Services() {
  const { content } = useContent();
  const services = content.services;

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

        <AnimatedSection stagger className="services-grid">
          {services.map((service) => {
            const Icon = iconMap[service.icone];
            return (
              <StaggerItem key={service.titre} variant="up">
                <motion.div
                  className="service-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="service-card-shine" aria-hidden="true" />
                  <div className="service-icon" aria-hidden="true">
                    {Icon && <Icon />}
                  </div>
                  <h3>{service.titre}</h3>
                  <p>{service.description}</p>
                  <span className="service-card-link">
                    En savoir plus <FaArrowRight />
                  </span>
                </motion.div>
              </StaggerItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
