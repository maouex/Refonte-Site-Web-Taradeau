import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { evenements } from '../data/siteData';

function parseDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  return { day, month };
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

export default function Evenements() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = (newDir) => {
    setDirection(newDir);
    setActiveIdx((prev) => {
      const next = prev + newDir;
      if (next < 0) return evenements.length - 1;
      if (next >= evenements.length) return 0;
      return next;
    });
  };

  const evt = evenements[activeIdx];
  const { day, month } = parseDate(evt.date);

  return (
    <section className="section evenements-section" aria-label="Événements à venir">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Événements à venir</h2>
            <p>Ne manquez rien de la vie taradéenne</p>
          </div>
        </AnimatedSection>

        {/* Immersive Slider */}
        <AnimatedSection delay={0.2}>
          <div className="event-slider">
            <button
              className="event-slider-arrow event-slider-prev"
              onClick={() => navigate(-1)}
              aria-label="Événement précédent"
            >
              <FaChevronLeft />
            </button>

            <div className="event-slider-stage">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIdx}
                  className="event-slider-card"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <div className="event-slider-date">
                    <span className="event-slider-day">{day}</span>
                    <span className="event-slider-month">{month}</span>
                  </div>
                  <div className="event-slider-info">
                    <h3>{evt.titre}</h3>
                    <div className="event-lieu">
                      <FaMapMarkerAlt />
                      {evt.lieu}
                    </div>
                    <p>{evt.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="event-slider-arrow event-slider-next"
              onClick={() => navigate(1)}
              aria-label="Événement suivant"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="event-dots" role="tablist">
            {evenements.map((_, i) => (
              <button
                key={i}
                className={`event-dot ${i === activeIdx ? 'active' : ''}`}
                onClick={() => {
                  setDirection(i > activeIdx ? 1 : -1);
                  setActiveIdx(i);
                }}
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Événement ${i + 1}`}
              />
            ))}
          </div>
        </AnimatedSection>

        {/* Mini cards below */}
        <AnimatedSection delay={0.4}>
          <div className="evenements-grid">
            {evenements.map((e, i) => {
              const d = parseDate(e.date);
              return (
                <motion.article
                  key={e.titre}
                  className={`event-card ${i === activeIdx ? 'event-card-active' : ''}`}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => {
                    setDirection(i > activeIdx ? 1 : -1);
                    setActiveIdx(i);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-date-strip">
                    <div className="event-date-day">{d.day}</div>
                    <div className="event-date-month">{d.month}</div>
                  </div>
                  <div className="event-body">
                    <h3>{e.titre}</h3>
                    <div className="event-lieu">
                      <FaMapMarkerAlt />
                      {e.lieu}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
