import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { useEvents } from '../context/EventContext';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, y: 30 },
};

const initialForm = { nom: '', prenom: '', email: '', telephone: '', nbPersonnes: 1 };

export default function ReservationModal({ event, onClose }) {
  const { addReservation, getEventPlacesRestantes } = useEvents();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!event) return null;

  const placesRestantes = getEventPlacesRestantes(event.id);

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = 'Nom requis';
    if (!form.prenom.trim()) errs.prenom = 'Prénom requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Email valide requis';
    if (!form.telephone.trim() || form.telephone.replace(/\s/g, '').length < 10)
      errs.telephone = 'Téléphone valide requis';
    if (form.nbPersonnes < 1) errs.nbPersonnes = 'Minimum 1 personne';
    if (form.nbPersonnes > placesRestantes)
      errs.nbPersonnes = `Maximum ${placesRestantes} places disponibles`;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    addReservation({
      eventId: event.id,
      eventTitre: event.titre,
      ...form,
      nbPersonnes: Number(form.nbPersonnes),
    });
    setSuccess(true);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="modal-content reservation-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Fermer">
            <FaTimes />
          </button>

          {success ? (
            <div className="reservation-success">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <FaCheckCircle className="success-icon" />
              </motion.div>
              <h2>Réservation confirmée !</h2>
              <p>
                Votre réservation pour <strong>{event.titre}</strong> a bien été
                enregistrée pour <strong>{form.nbPersonnes} personne{form.nbPersonnes > 1 ? 's' : ''}</strong>.
              </p>
              <p className="success-detail">
                Un email de confirmation sera envoyé à <strong>{form.email}</strong>.
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div className="reservation-header">
                <h2>Réserver ma place</h2>
                <div className="reservation-event-info">
                  <h3>{event.titre}</h3>
                  <div className="reservation-meta">
                    <span><FaCalendarAlt /> {parseDate(event.date)}</span>
                    <span><FaMapMarkerAlt /> {event.lieu}</span>
                    <span className="places-badge">
                      <FaUsers /> {placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {placesRestantes === 0 ? (
                <div className="reservation-complet">
                  <p>Cet événement est complet. Aucune réservation possible.</p>
                  <button className="btn btn-outline" onClick={onClose}>Fermer</button>
                </div>
              ) : (
                <form className="reservation-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="res-nom">Nom *</label>
                      <input
                        id="res-nom"
                        type="text"
                        value={form.nom}
                        onChange={handleChange('nom')}
                        placeholder="Votre nom"
                        className={errors.nom ? 'error' : ''}
                      />
                      {errors.nom && <span className="form-error">{errors.nom}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="res-prenom">Prénom *</label>
                      <input
                        id="res-prenom"
                        type="text"
                        value={form.prenom}
                        onChange={handleChange('prenom')}
                        placeholder="Votre prénom"
                        className={errors.prenom ? 'error' : ''}
                      />
                      {errors.prenom && <span className="form-error">{errors.prenom}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="res-email">Email *</label>
                      <input
                        id="res-email"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="votre@email.fr"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="res-tel">Téléphone *</label>
                      <input
                        id="res-tel"
                        type="tel"
                        value={form.telephone}
                        onChange={handleChange('telephone')}
                        placeholder="06 12 34 56 78"
                        className={errors.telephone ? 'error' : ''}
                      />
                      {errors.telephone && <span className="form-error">{errors.telephone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-nb">Nombre de personnes *</label>
                    <input
                      id="res-nb"
                      type="number"
                      min="1"
                      max={placesRestantes}
                      value={form.nbPersonnes}
                      onChange={handleChange('nbPersonnes')}
                      className={errors.nbPersonnes ? 'error' : ''}
                    />
                    {errors.nbPersonnes && <span className="form-error">{errors.nbPersonnes}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Confirmer ma réservation
                  </button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
