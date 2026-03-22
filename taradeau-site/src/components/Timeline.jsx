import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedSection from './AnimatedSection';

const timelineData = [
  {
    date: 'VIe s. av. J.-C.',
    titre: 'Oppidum du Fort',
    description: 'Installation d\'un oppidum celto-ligure sur la colline du Fort, témoignant des premières occupations humaines du territoire.',
  },
  {
    date: 'Ier s. av. J.-C.',
    titre: 'Période romaine',
    description: 'Romanisation de la région avec le développement de la viticulture dans la vallée de l\'Argens.',
  },
  {
    date: 'XIe siècle',
    titre: 'Chapelle Notre-Dame',
    description: 'Construction de la chapelle et de la tour médiévale qui dominent encore le village aujourd\'hui.',
  },
  {
    date: 'XVIIe siècle',
    titre: 'Le village provençal',
    description: 'Développement du village autour de l\'église, avec ses ruelles typiques et ses maisons en pierre.',
  },
  {
    date: '1790',
    titre: 'Commune officielle',
    description: 'Taradeau devient officiellement une commune lors de la Révolution française.',
  },
  {
    date: 'XXe siècle',
    titre: 'Essor viticole',
    description: 'Taradeau s\'affirme au cœur de l\'appellation Côtes de Provence avec ses domaines réputés.',
  },
  {
    date: 'Aujourd\'hui',
    titre: '1 786 habitants',
    description: 'Un village dynamique entre traditions provençales et modernité, au cœur de la communauté d\'agglomération Dracénoise.',
  },
];

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
