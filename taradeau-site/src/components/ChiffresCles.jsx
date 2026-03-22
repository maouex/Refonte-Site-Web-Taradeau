import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import AnimatedSection from './AnimatedSection';
import { chiffresCles } from '../data/siteData';

function AnimatedCounter({ target, decimales = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Taradeau en chiffres</h2>
            <p>Quelques données clés sur notre commune</p>
          </div>
        </AnimatedSection>

        <div className="chiffres-grid">
          {chiffresCles.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.15}>
              <div className="chiffre-item">
                <div className="chiffre-valeur">
                  <AnimatedCounter target={item.valeur} decimales={item.decimales || 0} />
                  {item.suffixe}
                </div>
                <div className="chiffre-label">{item.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
