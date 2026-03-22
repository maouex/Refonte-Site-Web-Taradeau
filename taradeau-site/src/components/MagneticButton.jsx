import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className="magnetic-button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={offset}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
