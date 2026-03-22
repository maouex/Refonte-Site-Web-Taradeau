import { motion } from 'framer-motion';

const petals = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 12 + 8,
  duration: Math.random() * 15 + 20,
  delay: Math.random() * 10,
  rotation: Math.random() * 360,
  opacity: Math.random() * 0.3 + 0.1,
}));

function PetalSVG({ size }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 10 18" fill="none">
      <ellipse cx="5" cy="9" rx="3.5" ry="8" fill="currentColor" />
      <ellipse cx="5" cy="9" rx="1.5" ry="6" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export default function LavenderPetals() {
  return (
    <div className="lavender-petals" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="lavender-petal"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            color: `rgba(${140 + Math.random() * 40}, ${100 + Math.random() * 30}, ${180 + Math.random() * 40}, ${p.opacity})`,
            rotate: p.rotation,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(p.id) * 60, Math.cos(p.id) * -40, Math.sin(p.id + 1) * 30, 0],
            rotate: [p.rotation, p.rotation + 360],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' },
            x: { duration: p.duration * 0.8, repeat: Infinity, delay: p.delay, ease: 'easeInOut' },
            rotate: { duration: p.duration * 1.2, repeat: Infinity, delay: p.delay, ease: 'linear' },
          }}
        >
          <PetalSVG size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}
