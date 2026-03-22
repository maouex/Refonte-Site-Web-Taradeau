import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

const itemScale = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 14 },
  },
};

const itemLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 },
  },
};

const variants = { up: itemUp, scale: itemScale, left: itemLeft, right: itemRight };

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  stagger = false,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    );
  }

  const v = variants[variant] || itemUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={v}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ ...v.visible?.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', variant = 'up' }) {
  const v = variants[variant] || itemUp;
  return (
    <motion.div className={className} variants={v}>
      {children}
    </motion.div>
  );
}
