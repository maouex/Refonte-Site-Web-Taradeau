import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaSun,
  FaCloudSun,
  FaSmog,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaSnowflake,
  FaBolt,
  FaWind,
  FaTemperatureHigh,
} from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';

/* ── WMO weather code mapping ── */
function getWeatherInfo(code) {
  if (code === 0) return { label: 'Ciel dégagé', Icon: FaSun, gradient: 'linear-gradient(135deg, #f6d365, #fda085)' };
  if (code >= 1 && code <= 3) return { label: 'Partiellement nuageux', Icon: FaCloudSun, gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' };
  if (code >= 45 && code <= 48) return { label: 'Brouillard', Icon: FaSmog, gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' };
  if (code >= 51 && code <= 55) return { label: 'Bruine', Icon: FaCloudRain, gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)' };
  if (code >= 61 && code <= 65) return { label: 'Pluie', Icon: FaCloudShowersHeavy, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' };
  if (code >= 71 && code <= 77) return { label: 'Neige', Icon: FaSnowflake, gradient: 'linear-gradient(135deg, #e6e9f0, #eef1f5)' };
  if (code >= 80 && code <= 82) return { label: 'Averses', Icon: FaCloudRain, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' };
  if (code >= 95 && code <= 99) return { label: 'Orage', Icon: FaBolt, gradient: 'linear-gradient(135deg, #434343, #000000)' };
  return { label: 'Inconnu', Icon: FaCloudSun, gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' };
}

const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=43.54&longitude=6.43&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&forecast_days=5';

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function formatDay(dateStr, index) {
  if (index === 0) return "Aujourd'hui";
  const d = new Date(dateStr + 'T00:00:00');
  return DAYS_FR[d.getDay()];
}

/* ── Styles ── */
const styles = {
  wrapper: {
    width: '100%',
    maxWidth: 520,
    margin: '0 auto',
    borderRadius: 20,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    transition: 'background var(--transition), color var(--transition), box-shadow var(--transition)',
  },
  header: {
    padding: '28px 28px 20px',
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    position: 'absolute',
    inset: 0,
    opacity: 0.12,
    borderRadius: 0,
    zIndex: 0,
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.15rem',
    fontWeight: 700,
    marginBottom: 4,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 400,
  },
  currentRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px 20px',
    gap: 16,
    flexWrap: 'wrap',
  },
  tempBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    color: '#fff',
    flexShrink: 0,
  },
  tempValue: {
    fontSize: '2.6rem',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  conditionLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: 2,
  },
  statsRow: {
    display: 'flex',
    gap: 18,
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  statIcon: {
    fontSize: 16,
    color: 'var(--or-accent)',
    flexShrink: 0,
  },
  divider: {
    height: 1,
    background: 'var(--border-color)',
    margin: '0 28px',
  },
  forecastGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 0,
    padding: '16px 12px 20px',
  },
  forecastItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '8px 4px',
    borderRadius: 12,
    cursor: 'default',
    transition: 'background var(--transition)',
  },
  forecastDay: {
    fontSize: '0.72rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  forecastIcon: {
    fontSize: 20,
    color: 'var(--or-accent)',
  },
  forecastTemps: {
    display: 'flex',
    gap: 6,
    fontSize: '0.78rem',
    fontWeight: 500,
  },
  forecastMax: {
    color: 'var(--text-primary)',
  },
  forecastMin: {
    color: 'var(--text-muted)',
  },
  /* Loading skeleton */
  skeleton: {
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  skeletonBar: (width, height = 14) => ({
    width,
    height,
    borderRadius: 8,
    background: 'var(--border-color)',
    animation: 'meteo-pulse 1.4s ease-in-out infinite',
  }),
  skeletonRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  skeletonCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--border-color)',
    animation: 'meteo-pulse 1.4s ease-in-out infinite',
    flexShrink: 0,
  },
  skeletonForecast: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 10,
    marginTop: 8,
  },
  skeletonForecastItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  /* Error */
  errorBox: {
    padding: 28,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 40,
    color: 'var(--or-accent)',
    marginBottom: 12,
  },
  errorTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.05rem',
    fontWeight: 600,
    marginBottom: 6,
  },
  errorMsg: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    borderRadius: 10,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background var(--transition), border-color var(--transition)',
  },
};

/* ── Keyframes (injected once) ── */
const KEYFRAME_ID = 'meteo-widget-keyframes';
function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes meteo-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Sub-components ── */
function LoadingSkeleton() {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonBar('55%', 18)} />
      <div style={styles.skeletonBar('35%', 12)} />
      <div style={{ ...styles.skeletonRow, marginTop: 8 }}>
        <div style={styles.skeletonCircle} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={styles.skeletonBar(100, 36)} />
          <div style={styles.skeletonBar(120, 12)} />
        </div>
      </div>
      <div style={styles.skeletonForecast}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={styles.skeletonForecastItem}>
            <div style={styles.skeletonBar(28, 10)} />
            <div style={{ ...styles.skeletonBar(24, 24), borderRadius: '50%' }} />
            <div style={styles.skeletonBar(40, 10)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div style={styles.errorBox}>
      <div style={styles.errorIcon}><FaCloudSun /></div>
      <div style={styles.errorTitle}>Météo indisponible</div>
      <p style={styles.errorMsg}>
        Impossible de charger les données météo pour Taradeau.<br />
        Veuillez réessayer dans quelques instants.
      </p>
      <button
        style={styles.retryBtn}
        onClick={onRetry}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
      >
        Réessayer
      </button>
    </div>
  );
}

/* ── Animation variants ── */
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16, staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

const forecastItemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

/* ── Main component ── */
export default function MeteoWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    if (inView && !hasFetched) {
      setHasFetched(true);
      fetchWeather();
    }
  }, [inView, hasFetched, fetchWeather]);

  const handleRetry = () => {
    fetchWeather();
  };

  /* ── Derived data ── */
  const current = data?.current;
  const daily = data?.daily;
  const currentInfo = current ? getWeatherInfo(current.weather_code) : null;

  return (
    <motion.div
      ref={ref}
      style={styles.wrapper}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingSkeleton />
          </motion.div>
        )}

        {error && !data && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState onRetry={handleRetry} />
          </motion.div>
        )}

        {data && currentInfo && (
          <motion.div key="data" variants={containerVariants} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div style={styles.header} variants={itemVariants}>
              <div style={{ ...styles.headerOverlay, background: currentInfo.gradient }} />
              <div style={styles.headerContent}>
                <div style={styles.title}>
                  <FaTemperatureHigh style={{ color: 'var(--rouge-provencal)', fontSize: 18 }} />
                  Météo Taradeau
                </div>
                <div style={styles.subtitle}>{currentInfo.label}</div>
              </div>
            </motion.div>

            {/* Current conditions */}
            <motion.div style={styles.currentRow} variants={itemVariants}>
              <div style={styles.tempBlock}>
                <motion.div
                  style={{ ...styles.iconCircle, background: currentInfo.gradient }}
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <currentInfo.Icon />
                </motion.div>
                <div>
                  <div style={styles.tempValue}>
                    {Math.round(current.temperature_2m)}°
                  </div>
                  <div style={styles.conditionLabel}>{currentInfo.label}</div>
                </div>
              </div>

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <WiHumidity style={{ ...styles.statIcon, fontSize: 22 }} />
                  <span>{current.relative_humidity_2m}%</span>
                </div>
                <div style={styles.stat}>
                  <FaWind style={styles.statIcon} />
                  <span>{Math.round(current.wind_speed_10m)} km/h</span>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* 5-day forecast */}
            {daily && (
              <div style={styles.forecastGrid}>
                {daily.time.map((date, i) => {
                  const info = getWeatherInfo(daily.weather_code[i]);
                  return (
                    <motion.div
                      key={date}
                      style={styles.forecastItem}
                      variants={forecastItemVariants}
                      whileHover={{ background: 'var(--bg-secondary)' }}
                    >
                      <span style={styles.forecastDay}>{formatDay(date, i)}</span>
                      <info.Icon style={styles.forecastIcon} />
                      <div style={styles.forecastTemps}>
                        <span style={styles.forecastMax}>{Math.round(daily.temperature_2m_max[i])}°</span>
                        <span style={styles.forecastMin}>{Math.round(daily.temperature_2m_min[i])}°</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
