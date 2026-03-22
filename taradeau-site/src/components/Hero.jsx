import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import { useContent } from '../context/ContentContext';

function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -80, -20, -100, 0],
            x: [0, 30, -20, 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

const wordVariants = {
  hidden: {},
  visible: (i) => ({
    transition: { staggerChildren: 0.04, delayChildren: 0.3 + i * 0.15 },
  }),
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

function AnimatedTitle({ text, className }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          variants={wordVariants}
          custom={wi}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block', marginRight: '0.3em', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              variants={letterVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 250]);
  const contentY = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1.05, 1.25]);

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      className="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      aria-label="Bienvenue à Taradeau"
    >
      {/* Parallax Background */}
      <motion.div
        className="hero-bg"
        aria-hidden="true"
        style={{
          y: bgY,
          scale,
          x: mousePos.x * -15,
        }}
      />

      {/* Animated gradient overlay */}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content with parallax */}
      <motion.div
        className="hero-content"
        style={{ y: contentY, opacity }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="hero-badge-dot" />
          {hero.badge}
        </motion.div>

        <h1>
          <AnimatedTitle text={hero.titre1} className="hero-line-1" />
          <br />
          <motion.span
            className="hero-highlight"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9, type: 'spring', stiffness: 80 }}
          >
            {hero.titreHighlight}
          </motion.span>
        </h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          {hero.sousTitre}
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        >
          <MagneticButton strength={0.25}>
            <Link to={hero.bouton1.lien} className="btn btn-primary btn-glow">
              <span>{hero.bouton1.label}</span>
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.25}>
            <Link to={hero.bouton2.lien} className="btn btn-outline btn-shine">
              <span>{hero.bouton2.label}</span>
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        aria-hidden="true"
      >
        <span>Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaChevronDown />
        </motion.div>
      </motion.div>
    </section>
  );
}
