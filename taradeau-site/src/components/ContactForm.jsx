import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheck,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa';

const subjects = [
  'Renseignements',
  'Urbanisme',
  'État civil',
  'Associations',
  'Autre',
];

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  objet: '',
  message: '',
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 100, damping: 16 },
  }),
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setSubmitted(false);
  };

  return (
    <section className="section contact-section" aria-label="Contactez la mairie" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        >
          <div className="accent-line" />
          <h2>Contactez-nous</h2>
          <p>La mairie de Taradeau est à votre écoute</p>
        </motion.div>

        <div className="contact-layout">
          {/* Sidebar — mairie info */}
          <motion.aside
            className="contact-info-card"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
          >
            <h3 className="contact-info-title">Mairie de Taradeau</h3>

            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-info-icon" aria-hidden="true" />
              <div>
                <strong>Adresse</strong>
                <p>Place Gabriel Péri</p>
                <p>83460 Taradeau</p>
              </div>
            </div>

            <div className="contact-info-item">
              <FaPhone className="contact-info-icon" aria-hidden="true" />
              <div>
                <strong>Téléphone</strong>
                <p>
                  <a href="tel:+33494730117">04 94 73 01 17</a>
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <FaEnvelope className="contact-info-icon" aria-hidden="true" />
              <div>
                <strong>Email</strong>
                <p>
                  <a href="mailto:mairie@taradeau.fr">mairie@taradeau.fr</a>
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <FaClock className="contact-info-icon" aria-hidden="true" />
              <div>
                <strong>Horaires d'ouverture</strong>
                <p>Lundi au vendredi</p>
                <p>8h30 — 12h00 / 13h30 — 17h00</p>
              </div>
            </div>
          </motion.aside>

          {/* Form */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="contact-success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div
                    className="contact-success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  >
                    <FaCheck />
                  </motion.div>
                  <h3>Message envoyé !</h3>
                  <p>
                    Merci pour votre message. La mairie de Taradeau vous répondra
                    dans les meilleurs délais.
                  </p>
                  <motion.button
                    className="contact-btn contact-btn--outline"
                    onClick={handleReset}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Envoyer un autre message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div className="contact-form-row">
                    <motion.div className="contact-field" custom={0} variants={fieldVariants}>
                      <label htmlFor="cf-nom">
                        <FaUser className="contact-field-icon" aria-hidden="true" />
                        Nom <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cf-nom"
                        type="text"
                        name="nom"
                        required
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="contact-field" custom={1} variants={fieldVariants}>
                      <label htmlFor="cf-prenom">
                        <FaUser className="contact-field-icon" aria-hidden="true" />
                        Prénom <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cf-prenom"
                        type="text"
                        name="prenom"
                        required
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                    </motion.div>
                  </div>

                  <div className="contact-form-row">
                    <motion.div className="contact-field" custom={2} variants={fieldVariants}>
                      <label htmlFor="cf-email">
                        <FaEnvelope className="contact-field-icon" aria-hidden="true" />
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cf-email"
                        type="email"
                        name="email"
                        required
                        placeholder="votre.email@exemple.fr"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="contact-field" custom={3} variants={fieldVariants}>
                      <label htmlFor="cf-telephone">
                        <FaPhone className="contact-field-icon" aria-hidden="true" />
                        Téléphone
                      </label>
                      <input
                        id="cf-telephone"
                        type="tel"
                        name="telephone"
                        placeholder="04 94 73 XX XX"
                        pattern="[0-9\s\+\-\.]{10,}"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    </motion.div>
                  </div>

                  <motion.div className="contact-field" custom={4} variants={fieldVariants}>
                    <label htmlFor="cf-objet">
                      Objet <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="cf-objet"
                      name="objet"
                      required
                      value={formData.objet}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        — Choisissez un objet —
                      </option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div className="contact-field" custom={5} variants={fieldVariants}>
                    <label htmlFor="cf-message">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Votre message..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </motion.div>

                  <motion.div custom={6} variants={fieldVariants}>
                    <motion.button
                      type="submit"
                      className="contact-btn contact-btn--primary"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaPaperPlane aria-hidden="true" />
                      Envoyer le message
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ---- Scoped styles ---- */}
      <style>{`
        .contact-section {
          padding: 5rem 0;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2.5rem;
          align-items: start;
          margin-top: 3rem;
        }

        /* ---- Info sidebar ---- */
        .contact-info-card {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
          box-shadow: var(--glass-shadow);
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .contact-info-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .contact-info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .contact-info-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
          font-size: 1.15rem;
          color: var(--rouge-provencal);
        }

        .contact-info-item strong {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .contact-info-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .contact-info-item a {
          color: var(--rouge-provencal);
          transition: color var(--transition);
        }

        .contact-info-item a:hover {
          color: var(--rouge-hover);
        }

        /* ---- Form card ---- */
        .contact-form-card {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 1.25rem;
          padding: 2.5rem;
          box-shadow: var(--glass-shadow);
          min-height: 460px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        /* ---- Fields ---- */
        .contact-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .contact-field label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-body);
        }

        .contact-field label span {
          color: var(--rouge-provencal);
        }

        .contact-field-icon {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .contact-field input,
        .contact-field select,
        .contact-field textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-primary);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 0.625rem;
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
        }

        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: var(--text-muted);
        }

        .contact-field input:focus,
        .contact-field select:focus,
        .contact-field textarea:focus {
          border-color: var(--rouge-provencal);
          box-shadow: 0 0 0 3px rgba(232, 78, 59, 0.15);
        }

        .contact-field input:invalid:not(:placeholder-shown),
        .contact-field select:invalid:not([value=""]),
        .contact-field textarea:invalid:not(:placeholder-shown) {
          border-color: var(--rouge-provencal);
        }

        .contact-field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-field select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238A9AB0' viewBox='0 0 16 16'%3E%3Cpath d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        /* ---- Buttons ---- */
        .contact-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.625rem;
          border: none;
          cursor: pointer;
          transition: background var(--transition), color var(--transition);
        }

        .contact-btn--primary {
          background: var(--rouge-provencal);
          color: #fff;
          width: 100%;
        }

        .contact-btn--primary:hover {
          background: var(--rouge-hover);
        }

        .contact-btn--outline {
          background: transparent;
          color: var(--rouge-provencal);
          border: 2px solid var(--rouge-provencal);
          margin-top: 1.5rem;
        }

        .contact-btn--outline:hover {
          background: var(--rouge-provencal);
          color: #fff;
        }

        /* ---- Success state ---- */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1rem;
        }

        .contact-success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rouge-provencal), var(--or-accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .contact-success h3 {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .contact-success p {
          color: var(--text-secondary);
          font-size: 1rem;
          max-width: 380px;
          line-height: 1.6;
        }

        /* ---- Responsive ---- */
        @media (max-width: 960px) {
          .contact-layout {
            grid-template-columns: 1fr;
          }

          .contact-info-card {
            order: 2;
          }

          .contact-form-card {
            order: 1;
          }
        }

        @media (max-width: 600px) {
          .contact-form-row {
            grid-template-columns: 1fr;
          }

          .contact-form-card,
          .contact-info-card {
            padding: 1.5rem;
          }

          .contact-section {
            padding: 3rem 0;
          }
        }
      `}</style>
    </section>
  );
}
