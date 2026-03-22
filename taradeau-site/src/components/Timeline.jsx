import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedSection from './AnimatedSection';
import { useContent } from '../context/ContentContext';

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.div
      ref={ref}
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
    >
      <motion.div
        className="timeline-dot"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
      />
      <div className="timeline-date">{item.date}</div>
      <div className="timeline-content">
        <h3>{item.titre}</h3>
        <p>{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const { content } = useContent();
  const timelineData = content.timeline;

  return (
    <section className="section timeline-section" aria-label="Histoire de Taradeau">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Notre histoire</h2>
            <p>De l'oppidum celto-ligure au village provençal d'aujourd'hui</p>
          </div>
        </AnimatedSection>

        <div className="timeline">
          {timelineData.map((item, i) => (
            <TimelineItem key={item.date} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
