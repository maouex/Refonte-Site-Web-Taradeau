import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPaperPlane, FaCheck, FaBell } from 'react-icons/fa';

const STORAGE_KEY = 'taradeau-newsletter-subscribers';

function getSubscribers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSubscriber(email) {
  const subscribers = getSubscribers();
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
  }
}

function isAlreadySubscribed(email) {
  return getSubscribers().includes(email.toLowerCase().trim());
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = {
  section: {
    width: '100%',
    padding: '5rem 1.5rem',
    background: 'linear-gradient(135deg, var(--bleu-nuit) 0%, var(--rouge-provencal) 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
    position: 'relative',
    zIndex: 1,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  right: {
    flex: 1,
    minWidth: 0,
  },
  iconBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(201,168,76,0.2)',
    border: '1px solid rgba(201,168,76,0.4)',
    marginBottom: '1.25rem',
    color: 'var(--or-accent)',
    fontSize: '1.5rem',
  },
  heading: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 0.75rem 0',
    lineHeight: 1.2,
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    maxWidth: '460px',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginTop: '1.25rem',
    listStyle: 'none',
    padding: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.75)',
  },
  featureDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--or-accent)',
    flexShrink: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '2rem',
  },
  formLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '0 1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    marginBottom: '0.5rem',
  },
  inputWrapperFocus: {
    borderColor: 'var(--or-accent)',
    boxShadow: '0 0 0 3px rgba(201,168,76,0.25)',
  },
  inputIcon: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '1rem',
    flexShrink: 0,
    marginRight: '0.75rem',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: '#FFFFFF',
    padding: '0.875rem 0',
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: '#FF9B8E',
    marginTop: '0.25rem',
    minHeight: '1.25rem',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '0.9rem 1.5rem',
    marginTop: '0.5rem',
    border: 'none',
    borderRadius: '12px',
    background: 'var(--or-accent)',
    color: 'var(--bleu-nuit)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem 0',
  },
  successIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(72,199,142,0.2)',
    border: '2px solid rgba(72,199,142,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: '#48C78E',
    fontSize: '1.5rem',
  },
  successHeading: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 0.5rem 0',
  },
  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    margin: 0,
  },
  duplicateText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: '#FFD97D',
    marginTop: '0.25rem',
    minHeight: '1.25rem',
  },
};

const mediaQuery = `
  @media (max-width: 768px) {
    .newsletter-container {
      flex-direction: column !important;
      text-align: center;
    }
    .newsletter-description {
      max-width: 100% !important;
    }
    .newsletter-features {
      align-items: center;
    }
  }
`;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const validate = (value) => {
    if (!value.trim()) return 'Veuillez saisir votre adresse e-mail.';
    if (!emailRegex.test(value.trim())) return 'Adresse e-mail invalide.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDuplicate(false);
    const trimmed = email.toLowerCase().trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (isAlreadySubscribed(trimmed)) {
      setDuplicate(true);
      setError('');
      return;
    }
    addSubscriber(trimmed);
    setError('');
    setDuplicate(false);
    setSuccess(true);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (duplicate) setDuplicate(false);
  };

  return (
    <>
      <style>{mediaQuery}</style>
      <section ref={ref} style={styles.section} aria-label="Inscription à la newsletter">
        <div style={styles.overlay} />
        <motion.div
          className="newsletter-container"
          style={styles.container}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
        >
          {/* Left side - description */}
          <motion.div
            style={styles.left}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, type: 'spring', stiffness: 80, damping: 16 }}
          >
            <div style={styles.iconBadge}>
              <FaBell />
            </div>
            <h2 style={styles.heading}>Restez informé de la vie du village</h2>
            <p className="newsletter-description" style={styles.description}>
              Recevez les dernières actualités de Taradeau directement dans votre boîte mail :
              événements, délibérations municipales et informations pratiques.
            </p>
            <ul className="newsletter-features" style={styles.features}>
              {[
                'Actualités et événements locaux',
                'Informations municipales',
                'Vie associative et culturelle',
              ].map((text) => (
                <li key={text} style={styles.featureItem}>
                  <span style={styles.featureDot} />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right side - form */}
          <motion.div
            style={styles.right}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, type: 'spring', stiffness: 80, damping: 16 }}
          >
            <div style={styles.card}>
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                  >
                    <label style={styles.formLabel} htmlFor="newsletter-email">
                      Adresse e-mail
                    </label>
                    <div
                      style={{
                        ...styles.inputWrapper,
                        ...(focused ? styles.inputWrapperFocus : {}),
                      }}
                    >
                      <FaEnvelope style={styles.inputIcon} />
                      <input
                        id="newsletter-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={styles.input}
                        autoComplete="email"
                        aria-describedby="newsletter-error"
                      />
                    </div>
                    {error && (
                      <div id="newsletter-error" style={styles.errorText} role="alert">
                        {error}
                      </div>
                    )}
                    {duplicate && (
                      <div style={styles.duplicateText} role="alert">
                        Cette adresse est déjà inscrite à la newsletter.
                      </div>
                    )}
                    {!error && !duplicate && <div style={{ minHeight: '1.25rem' }} />}
                    <motion.button
                      type="submit"
                      style={styles.button}
                      whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(201,168,76,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaPaperPlane />
                      S&rsquo;inscrire à la newsletter
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    style={styles.successContainer}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  >
                    <motion.div
                      style={styles.successIconCircle}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <FaCheck />
                    </motion.div>
                    <h3 style={styles.successHeading}>Inscription confirmée !</h3>
                    <p style={styles.successText}>
                      Merci ! Vous recevrez bientôt les actualités de Taradeau.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
