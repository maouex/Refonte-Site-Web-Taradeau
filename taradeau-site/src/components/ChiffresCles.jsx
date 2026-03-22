import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedSection, { StaggerItem } from './AnimatedSection';
import { chiffresCles } from '../data/siteData';

function AnimatedCounter({ target, decimales = 0, duration = 2500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Elastic easing
      const eased =
        progress === 1
          ? 1
          : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * (2 * Math.PI / 3));
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  const display = decimales > 0 ? count.toFixed(decimales) : Math.round(count);
  return <span ref={ref}>{display}</span>;
}

export default function ChiffresCles() {
  return (
    <section className="section chiffres-section" aria-label="Chiffres clés">
      <div className="chiffres-bg-shapes" aria-hidden="true">
        <div className="chiffres-shape chiffres-shape-1" />
        <div className="chiffres-shape chiffres-shape-2" />
        <div className="chiffres-shape chiffres-shape-3" />
      </div>
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Taradeau en chiffres</h2>
            <p>Quelques données clés sur notre commune</p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger className="chiffres-grid">
          {chiffresCles.map((item) => (
            <StaggerItem key={item.label} variant="scale">
              <motion.div
                className="chiffre-item"
                whileHover={{ scale: 1.06, y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="chiffre-valeur">
                  <AnimatedCounter target={item.valeur} decimales={item.decimales || 0} />
                  {item.suffixe}
                </div>
                <div className="chiffre-label">{item.label}</div>
                <div className="chiffre-glow" aria-hidden="true" />
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
