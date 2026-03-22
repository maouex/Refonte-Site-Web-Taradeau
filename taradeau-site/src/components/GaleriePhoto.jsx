import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaChurch,
  FaLandmark,
  FaMonument,
  FaWineGlass,
  FaTree,
  FaSeedling,
  FaHome,
  FaWater,
  FaRoad,
  FaFire,
  FaStore,
  FaMusic,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCamera,
} from 'react-icons/fa';

/* ─── Icon map ─── */
const iconMap = {
  FaChurch: FaChurch,
  FaLandmark: FaLandmark,
  FaMonument: FaMonument,
  FaWineGlass: FaWineGlass,
  FaTree: FaTree,
  FaSeedling: FaSeedling,
  FaHome: FaHome,
  FaWater: FaWater,
  FaRoad: FaRoad,
  FaFire: FaFire,
  FaStore: FaStore,
  FaMusic: FaMusic,
};

/* ─── Category gradients ─── */
const categoryGradients = {
  Patrimoine: 'linear-gradient(135deg, #1A2B4A 0%, #E84E3B 100%)',
  Nature: 'linear-gradient(135deg, #2E7D32 0%, #81C784 100%)',
  Village: 'linear-gradient(135deg, #C9A84C 0%, #E84E3B 100%)',
  Événements: 'linear-gradient(135deg, #E84E3B 0%, #C9A84C 100%)',
};

/* ─── Photo data ─── */
const photos = [
  { id: 1, src: null, titre: 'Chapelle Saint-Martin', categorie: 'Patrimoine', icon: 'FaChurch' },
  { id: 2, src: null, titre: "Tour de l'Horloge", categorie: 'Patrimoine', icon: 'FaLandmark' },
  { id: 3, src: null, titre: 'Dolmen de la Gastée', categorie: 'Patrimoine', icon: 'FaMonument' },
  { id: 4, src: null, titre: 'Vignobles en automne', categorie: 'Nature', icon: 'FaWineGlass' },
  { id: 5, src: null, titre: 'Forêt des Maures', categorie: 'Nature', icon: 'FaTree' },
  { id: 6, src: null, titre: 'Lavandes en fleur', categorie: 'Nature', icon: 'FaSeedling' },
  { id: 7, src: null, titre: 'Place du village', categorie: 'Village', icon: 'FaHome' },
  { id: 8, src: null, titre: 'Fontaine ancienne', categorie: 'Village', icon: 'FaWater' },
  { id: 9, src: null, titre: 'Ruelles provençales', categorie: 'Village', icon: 'FaRoad' },
  { id: 10, src: null, titre: 'Fête de la Saint-Jean', categorie: 'Événements', icon: 'FaFire' },
  { id: 11, src: null, titre: 'Marché provençal', categorie: 'Événements', icon: 'FaStore' },
  { id: 12, src: null, titre: "Concert d'été", categorie: 'Événements', icon: 'FaMusic' },
];

const categories = ['Toutes', 'Patrimoine', 'Nature', 'Village', 'Événements'];

/* ─── Styles ─── */
const styles = {
  section: {
    padding: '6rem 1.5rem',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  accentLine: {
    width: 60,
    height: 4,
    background: 'var(--rouge-provencal)',
    borderRadius: 2,
    margin: '0 auto 1.5rem',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.125rem',
    color: 'var(--text-secondary)',
    maxWidth: 600,
    margin: '0 auto',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '2.5rem',
  },
  filterBtn: (active) => ({
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    fontWeight: 500,
    padding: '0.6rem 1.5rem',
    borderRadius: '2rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: active ? 'var(--rouge-provencal)' : 'var(--glass-bg)',
    color: active ? '#fff' : 'var(--text-primary)',
    boxShadow: active ? '0 4px 16px rgba(232, 78, 59, 0.3)' : 'var(--shadow-sm)',
    backdropFilter: active ? 'none' : 'blur(10px)',
    border: active ? '1px solid var(--rouge-provencal)' : '1px solid var(--glass-border)',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  card: {
    position: 'relative',
    borderRadius: '1rem',
    overflow: 'hidden',
    cursor: 'pointer',
    aspectRatio: '4 / 3',
    boxShadow: 'var(--shadow-md)',
  },
  cardBg: (gradient) => ({
    position: 'absolute',
    inset: 0,
    background: gradient,
  }),
  cardIconWrap: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: '3.5rem',
    color: 'rgba(255, 255, 255, 0.25)',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.25rem',
  },
  cardTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '0.25rem',
  },
  cardCategory: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardHoverIcon: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(8px)',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.85rem',
  },
  /* Lightbox */
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxContent: {
    position: 'relative',
    width: '90vw',
    maxWidth: 800,
    aspectRatio: '4 / 3',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  lightboxBg: (gradient) => ({
    position: 'absolute',
    inset: 0,
    background: gradient,
  }),
  lightboxIconWrap: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxIcon: {
    fontSize: '6rem',
    color: 'rgba(255, 255, 255, 0.2)',
  },
  lightboxOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
  },
  lightboxInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2rem',
  },
  lightboxTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.5rem',
  },
  lightboxCategory: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  closeBtn: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 10000,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.25rem',
  },
  navBtn: (side) => ({
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: '1.5rem',
    zIndex: 10000,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.1rem',
  }),
  counter: {
    position: 'fixed',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10000,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    padding: '0.4rem 1rem',
    borderRadius: '1rem',
  },
};

/* ─── Responsive style tag ─── */
const responsiveCSS = `
  .galerie-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 1024px) {
    .galerie-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .galerie-grid {
      grid-template-columns: 1fr;
    }
  }
`;

/* ─── PhotoCard sub-component ─── */
function PhotoCard({ photo, index, onClick }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const IconComponent = iconMap[photo.icon];
  const gradient = categoryGradients[photo.categorie];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        style={styles.card}
        whileHover="hover"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Voir ${photo.titre}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <motion.div
          style={styles.cardBg(gradient)}
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <div style={styles.cardIconWrap}>
          {IconComponent && (
            <motion.div
              style={styles.cardIcon}
              variants={{ hover: { scale: 1.15, color: 'rgba(255,255,255,0.4)' } }}
              transition={{ duration: 0.4 }}
            >
              <IconComponent />
            </motion.div>
          )}
        </div>
        <div style={styles.cardOverlay} />
        <div style={styles.cardContent}>
          <motion.div
            style={styles.cardTitle}
            variants={{ hover: { y: -4 } }}
            transition={{ duration: 0.3 }}
          >
            {photo.titre}
          </motion.div>
          <div style={styles.cardCategory}>{photo.categorie}</div>
        </div>
        <motion.div
          style={styles.cardHoverIcon}
          initial={{ opacity: 0, scale: 0.5 }}
          variants={{ hover: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.3 }}
        >
          <FaCamera />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Lightbox sub-component ─── */
function Lightbox({ photo, onClose, onPrev, onNext, current, total }) {
  const IconComponent = iconMap[photo.icon];
  const gradient = categoryGradients[photo.categorie];

  return (
    <motion.div
      style={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo : ${photo.titre}`}
    >
      {/* Close button */}
      <motion.button
        style={styles.closeBtn}
        onClick={onClose}
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.25)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Fermer"
      >
        <FaTimes />
      </motion.button>

      {/* Prev */}
      <motion.button
        style={styles.navBtn('left')}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.25)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Photo précédente"
      >
        <FaChevronLeft />
      </motion.button>

      {/* Next */}
      <motion.button
        style={styles.navBtn('right')}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.25)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Photo suivante"
      >
        <FaChevronRight />
      </motion.button>

      {/* Image content */}
      <motion.div
        style={styles.lightboxContent}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.lightboxBg(gradient)} />
        <div style={styles.lightboxIconWrap}>
          {IconComponent && (
            <motion.div
              style={styles.lightboxIcon}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <IconComponent />
            </motion.div>
          )}
        </div>
        <div style={styles.lightboxOverlay} />
        <div style={styles.lightboxInfo}>
          <motion.div
            style={styles.lightboxTitle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {photo.titre}
          </motion.div>
          <motion.div
            style={styles.lightboxCategory}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {photo.categorie}
          </motion.div>
        </div>
      </motion.div>

      {/* Counter */}
      <div style={styles.counter}>
        {current} / {total}
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function GaleriePhoto() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const filteredPhotos =
    activeCategory === 'Toutes'
      ? photos
      : photos.filter((p) => p.categorie === activeCategory);

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  }, [filteredPhotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === filteredPhotos.length - 1 ? 0 : prev + 1
    );
  }, [filteredPhotos.length]);

  /* Keyboard navigation */
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  /* Reset lightbox index when category changes */
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

  return (
    <section style={styles.section} aria-label="Galerie photo" ref={sectionRef}>
      <style>{responsiveCSS}</style>

      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={sectionInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={styles.accentLine} />
        <h2 style={styles.title}>Galerie photo</h2>
        <p style={styles.subtitle}>
          Découvrez Taradeau à travers ses paysages, son patrimoine et ses événements
        </p>
      </motion.div>

      {/* Category filters */}
      <motion.div
        style={styles.filters}
        initial={{ opacity: 0, y: 20 }}
        animate={sectionInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            style={styles.filterBtn(activeCategory === cat)}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Photo grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="galerie-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredPhotos.map((photo, idx) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={idx}
              onClick={() => openLightbox(idx)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <Lightbox
            key={filteredPhotos[lightboxIndex].id}
            photo={filteredPhotos[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            current={lightboxIndex + 1}
            total={filteredPhotos.length}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
