import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" aria-label="Bienvenue à Taradeau">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="hero-badge">
          ◆ Village provençal du Var
        </div>

        <h1>
          Bienvenue à<br />
          <span>Taradeau</span>
        </h1>

        <p className="hero-subtitle">
          Entre vignobles et patrimoine médiéval — 1 786 habitants au cœur de la Dracénie
        </p>

        <div className="hero-buttons">
          <Link to="/commune" className="btn btn-primary">
            Découvrir la commune
          </Link>
          <Link to="/services/demarches" className="btn btn-outline">
            Vos démarches
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
      >
        <span>Défiler</span>
        <FaChevronDown />
      </motion.div>
    </section>
  );
}
