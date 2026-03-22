import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaFileAlt,
  FaImages,
  FaMapMarkedAlt,
  FaNewspaper,
} from 'react-icons/fa';
import AnimatedSection, { StaggerItem } from './AnimatedSection';
import { useContent } from '../context/ContentContext';

const iconMap = {
  FaCalendarAlt: FaCalendarAlt,
  FaFileAlt: FaFileAlt,
  FaImages: FaImages,
  FaMapMarkedAlt: FaMapMarkedAlt,
  FaNewspaper: FaNewspaper,
};

function TiltCard({ children }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ rotateY: x * 8, rotateX: -y * 8 });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={tilt}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

export default function AccesRapides() {
  const { content } = useContent();
  const accesRapides = content.accesRapides;

  return (
    <section className="acces-rapides" aria-label="Accès rapides">
      <div className="container">
        <AnimatedSection stagger className="acces-grid">
          {accesRapides.map((item) => {
            const Icon = iconMap[item.icone];
            return (
              <StaggerItem key={item.titre} variant="scale">
                <TiltCard>
                  <div className="acces-card" role="button" tabIndex={0}>
                    <div className="acces-card-shimmer" aria-hidden="true" />
                    <div className="acces-card-icon" aria-hidden="true">
                      {Icon && <Icon />}
                    </div>
                    <h3>{item.titre}</h3>
                    <p>{item.description}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
