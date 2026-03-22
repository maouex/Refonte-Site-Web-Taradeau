import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaTicketAlt, FaUsers } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import ReservationModal from './ReservationModal';
import { useEvents } from '../context/EventContext';

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
  const { events, getEventPlacesRestantes } = useEvents();
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [reservingEvent, setReservingEvent] = useState(null);

  if (events.length === 0) return null;

  const navigate = (newDir) => {
    setDirection(newDir);
    setActiveIdx((prev) => {
      const next = prev + newDir;
      if (next < 0) return events.length - 1;
      if (next >= events.length) return 0;
      return next;
    });
  };

  const evt = events[activeIdx];
  const { day, month } = parseDate(evt.date);
  const placesRestantes = getEventPlacesRestantes(evt.id);

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
                    <div className="event-slider-footer">
                      <span className="event-places">
                        <FaUsers /> {placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}
                      </span>
                      {evt.reservationsOuvertes && placesRestantes > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setReservingEvent(evt)}
                        >
                          <FaTicketAlt /> Réserver
                        </button>
                      )}
                    </div>
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
            {events.map((_, i) => (
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
            {events.map((e, i) => {
              const d = parseDate(e.date);
              const places = getEventPlacesRestantes(e.id);
              return (
                <motion.article
                  key={e.id}
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
                    <div className="event-card-footer">
                      <small className="event-places-small">
                        <FaUsers /> {places} places
                      </small>
                      {e.reservationsOuvertes && places > 0 && (
                        <button
                          className="btn btn-xs btn-primary"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setReservingEvent(e);
                          }}
                        >
                          Réserver
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </AnimatedSection>
      </div>

      {/* Reservation Modal */}
      {reservingEvent && (
        <ReservationModal
          event={reservingEvent}
          onClose={() => setReservingEvent(null)}
        />
      )}
    </section>
  );
}
