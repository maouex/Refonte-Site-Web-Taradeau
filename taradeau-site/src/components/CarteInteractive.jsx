import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLandmark,
  FaChurch,
  FaFortAwesome,
  FaMonument,
  FaWineGlassAlt,
  FaSchool,
  FaTimes,
  FaMapMarkerAlt,
  FaDirections,
  FaFilter,
} from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';

/* ─── Points of Interest Data ─── */
const pointsInteret = [
  { id: 1, nom: 'Mairie', type: 'administration', icon: 'FaLandmark', lat: 43.5381, lng: 6.4267, description: 'Place Gabriel Péri' },
  { id: 2, nom: 'Chapelle Saint-Martin', type: 'patrimoine', icon: 'FaChurch', lat: 43.5395, lng: 6.4280, description: 'XIe siècle, monument historique' },
  { id: 3, nom: 'Oppidum du Fort', type: 'patrimoine', icon: 'FaFortAwesome', lat: 43.5410, lng: 6.4250, description: 'Site archéologique celto-ligure' },
  { id: 4, nom: 'Dolmen de la Gastée', type: 'patrimoine', icon: 'FaMonument', lat: 43.5360, lng: 6.4200, description: 'Monument mégalithique' },
  { id: 5, nom: 'Cave coopérative', type: 'tourisme', icon: 'FaWineGlass', lat: 43.5370, lng: 6.4290, description: 'Vins AOC Côtes de Provence' },
  { id: 6, nom: 'École', type: 'education', icon: 'FaSchool', lat: 43.5375, lng: 6.4260, description: 'École primaire' },
];

/* ─── Icon Mapping ─── */
const iconMap = {
  FaLandmark: FaLandmark,
  FaChurch: FaChurch,
  FaFortAwesome: FaFortAwesome,
  FaMonument: FaMonument,
  FaWineGlass: FaWineGlassAlt,
  FaSchool: FaSchool,
};

/* ─── Category Configuration ─── */
const categories = [
  { key: 'tous', label: 'Tous', icon: FaFilter },
  { key: 'administration', label: 'Administration', icon: FaLandmark },
  { key: 'patrimoine', label: 'Patrimoine', icon: FaChurch },
  { key: 'tourisme', label: 'Tourisme', icon: FaWineGlassAlt },
  { key: 'education', label: 'Éducation', icon: FaSchool },
];

const categoryColors = {
  administration: 'var(--rouge-provencal)',
  patrimoine: 'var(--or-accent)',
  tourisme: '#6B8E23',
  education: 'var(--bleu-clair)',
};

/* ─── Bounding Box for coordinate → % conversion ─── */
const BBOX = {
  west: 6.41,
  east: 6.45,
  south: 43.53,
  north: 43.55,
};

function latLngToPercent(lat, lng) {
  const x = ((lng - BBOX.west) / (BBOX.east - BBOX.west)) * 100;
  // Y is inverted: north = top (0%), south = bottom (100%)
  const y = ((BBOX.north - lat) / (BBOX.north - BBOX.south)) * 100;
  return { x, y };
}

/* ─── Styles ─── */
const styles = {
  section: {
    padding: '5rem 0',
  },
  mapWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-card)',
  },
  iframe: {
    width: '100%',
    height: '500px',
    border: 'none',
    display: 'block',
    filter: 'var(--map-filter, none)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
  },
  filtersBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  filterBtn: (active, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    border: `2px solid ${active ? color : 'var(--border-color)'}`,
    background: active ? color : 'var(--bg-card)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    whiteSpace: 'nowrap',
  }),
  marker: (color) => ({
    position: 'absolute',
    pointerEvents: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50% 50% 50% 0',
    background: color,
    color: '#fff',
    fontSize: '0.9rem',
    boxShadow: `0 2px 8px ${color}88`,
    transform: 'translate(-50%, -100%) rotate(-45deg)',
    zIndex: 3,
  }),
  markerIcon: {
    transform: 'rotate(45deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    pointerEvents: 'auto',
    width: 'min(90%, 380px)',
    background: 'var(--bg-card)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  infoCardHeader: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
    color: '#fff',
  }),
  infoCardBody: {
    padding: '1rem 1.25rem',
  },
  infoCardName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: '#fff',
    flex: 1,
  },
  infoCardDesc: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    marginBottom: '0.75rem',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  directionLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'var(--rouge-provencal)',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'var(--transition)',
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: '50px',
    background: `${color}18`,
    color: color,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    marginBottom: '0.5rem',
  }),
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  legendDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
  }),
};

/* ─── Responsive style tag ─── */
const responsiveCSS = `
  .carte-interactive-iframe {
    height: 500px;
  }
  [data-theme='dark'] .carte-interactive-iframe {
    filter: brightness(0.85) contrast(1.1) saturate(0.8) hue-rotate(180deg) invert(1);
  }
  @media (max-width: 768px) {
    .carte-interactive-iframe {
      height: 380px;
    }
    .carte-interactive-filters {
      gap: 0.35rem;
    }
    .carte-interactive-filters button {
      padding: 0.4rem 0.75rem !important;
      font-size: 0.78rem !important;
    }
    .carte-interactive-marker {
      width: 28px !important;
      height: 28px !important;
      font-size: 0.7rem !important;
    }
  }
  @media (max-width: 480px) {
    .carte-interactive-iframe {
      height: 300px;
    }
  }
`;

/* ─── Animation Variants ─── */
const markerVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 400, damping: 20 },
  }),
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

const infoCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const pulseVariants = {
  hover: {
    scale: 1.2,
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    transition: { type: 'spring', stiffness: 300 },
  },
};

/* ─── Component ─── */
export default function CarteInteractive() {
  const [activeFilter, setActiveFilter] = useState('tous');
  const [selectedPOI, setSelectedPOI] = useState(null);

  const filteredPoints = useMemo(
    () =>
      activeFilter === 'tous'
        ? pointsInteret
        : pointsInteret.filter((p) => p.type === activeFilter),
    [activeFilter]
  );

  const handleMarkerClick = useCallback((poi) => {
    setSelectedPOI((prev) => (prev?.id === poi.id ? null : poi));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPOI(null);
  }, []);

  const handleFilterChange = useCallback((key) => {
    setActiveFilter(key);
    setSelectedPOI(null);
  }, []);

  const categoryLabel = (type) => {
    const cat = categories.find((c) => c.key === type);
    return cat ? cat.label : type;
  };

  const iframeSrc =
    'https://www.openstreetmap.org/export/embed.html?bbox=6.41,43.53,6.45,43.55&layer=mapnik&marker=43.5381,6.4267';

  return (
    <section className="section" style={styles.section} aria-label="Carte interactive de Taradeau">
      <style>{responsiveCSS}</style>
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Carte interactive</h2>
            <p>Explorez les lieux emblématiques de Taradeau</p>
          </div>
        </AnimatedSection>

        {/* Filter buttons */}
        <AnimatedSection delay={0.1}>
          <div style={styles.filtersBar} className="carte-interactive-filters" role="group" aria-label="Filtrer par catégorie">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.key;
              const color = cat.key === 'tous' ? 'var(--bleu-nuit)' : categoryColors[cat.key];
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.key}
                  style={styles.filterBtn(isActive, color)}
                  onClick={() => handleFilterChange(cat.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={isActive}
                  aria-label={`Filtrer : ${cat.label}`}
                >
                  <Icon size={14} />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Map container */}
        <AnimatedSection delay={0.2}>
          <div style={styles.mapWrapper}>
            {/* OSM iframe base layer */}
            <iframe
              className="carte-interactive-iframe"
              title="Carte OpenStreetMap de Taradeau"
              src={iframeSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={styles.iframe}
              tabIndex={-1}
              aria-hidden="true"
            />

            {/* POI overlay */}
            <div style={styles.overlay} aria-label="Points d'intérêt">
              <AnimatePresence mode="popLayout">
                {filteredPoints.map((poi, i) => {
                  const pos = latLngToPercent(poi.lat, poi.lng);
                  const color = categoryColors[poi.type];
                  const IconComp = iconMap[poi.icon] || FaMapMarkerAlt;
                  const isSelected = selectedPOI?.id === poi.id;

                  return (
                    <motion.button
                      key={poi.id}
                      className="carte-interactive-marker"
                      custom={i}
                      variants={markerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover="hover"
                      style={{
                        ...styles.marker(color),
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        zIndex: isSelected ? 5 : 3,
                        border: 'none',
                        outline: isSelected ? '3px solid #fff' : 'none',
                      }}
                      onClick={() => handleMarkerClick(poi)}
                      aria-label={`${poi.nom} — ${poi.description}`}
                      title={poi.nom}
                    >
                      <motion.span style={styles.markerIcon} variants={pulseVariants}>
                        <IconComp />
                      </motion.span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Info card */}
              <AnimatePresence>
                {selectedPOI && (
                  <motion.div
                    key={`info-${selectedPOI.id}`}
                    style={styles.infoCard}
                    variants={infoCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="dialog"
                    aria-label={`Détails : ${selectedPOI.nom}`}
                  >
                    <div style={styles.infoCardHeader(categoryColors[selectedPOI.type])}>
                      {(() => {
                        const Icon = iconMap[selectedPOI.icon] || FaMapMarkerAlt;
                        return <Icon size={22} />;
                      })()}
                      <span style={styles.infoCardName}>{selectedPOI.nom}</span>
                      <button
                        style={styles.closeBtn}
                        onClick={handleClose}
                        aria-label="Fermer"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div style={styles.infoCardBody}>
                      <span style={styles.badge(categoryColors[selectedPOI.type])}>
                        {categoryLabel(selectedPOI.type)}
                      </span>
                      <div style={styles.infoCardDesc}>
                        <FaMapMarkerAlt style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span>{selectedPOI.description}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPOI.lat},${selectedPOI.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.directionLink}
                        aria-label={`Itinéraire vers ${selectedPOI.nom}`}
                      >
                        <FaDirections />
                        Itinéraire
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>

        {/* Legend */}
        <AnimatedSection delay={0.3}>
          <div style={styles.legend} role="list" aria-label="Légende de la carte">
            {Object.entries(categoryColors).map(([type, color]) => (
              <div key={type} style={styles.legendItem} role="listitem">
                <span style={styles.legendDot(color)} aria-hidden="true" />
                <span>{categoryLabel(type)}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
