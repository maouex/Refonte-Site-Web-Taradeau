import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLandmark } from 'react-icons/fa';

export default function Preloader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('taradeau-loaded');
    }
    return true;
  });

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('taradeau-loaded', '1');
    }, 1800);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div
            className="preloader-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <FaLandmark />
          </motion.div>

          <motion.div
            className="preloader-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Mairie de Taradeau
          </motion.div>

          <motion.div
            className="preloader-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="preloader-bar-fill" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
