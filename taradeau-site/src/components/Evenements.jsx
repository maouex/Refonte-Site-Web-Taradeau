import { FaMapMarkerAlt } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { evenements } from '../data/siteData';

function parseDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  return { day, month };
}

export default function Evenements() {
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

        <div className="evenements-grid">
          {evenements.map((evt, i) => {
            const { day, month } = parseDate(evt.date);
            return (
              <AnimatedSection key={evt.titre} delay={i * 0.1}>
                <article className="event-card">
                  <div className="event-date-strip">
                    <div className="event-date-day">{day}</div>
                    <div className="event-date-month">{month}</div>
                  </div>
                  <div className="event-body">
                    <h3>{evt.titre}</h3>
                    <div className="event-lieu">
                      <FaMapMarkerAlt />
                      {evt.lieu}
                    </div>
                    <p>{evt.description}</p>
                  </div>
                </article>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
