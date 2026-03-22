import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaToggleOn, FaToggleOff,
} from 'react-icons/fa';
import { useEvents } from '../../context/EventContext';

const emptyEvent = {
  titre: '',
  date: '',
  lieu: '',
  description: '',
  capacite: 100,
  reservationsOuvertes: true,
};

function EventForm({ event, onSave, onCancel }) {
  const [form, setForm] = useState(event || emptyEvent);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.titre.trim()) errs.titre = 'Titre requis';
    if (!form.date) errs.date = 'Date requise';
    if (!form.lieu.trim()) errs.lieu = 'Lieu requis';
    if (!form.description.trim()) errs.description = 'Description requise';
    if (form.capacite < 1) errs.capacite = 'Capacité minimum 1';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(form);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form
      className="admin-event-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Titre de l'événement *</label>
          <input
            type="text"
            value={form.titre}
            onChange={handleChange('titre')}
            placeholder="Nom de l'événement"
            className={errors.titre ? 'error' : ''}
          />
          {errors.titre && <span className="form-error">{errors.titre}</span>}
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Lieu *</label>
          <input
            type="text"
            value={form.lieu}
            onChange={handleChange('lieu')}
            placeholder="Lieu de l'événement"
            className={errors.lieu ? 'error' : ''}
          />
          {errors.lieu && <span className="form-error">{errors.lieu}</span>}
        </div>
        <div className="form-group">
          <label>Capacité (places)</label>
          <input
            type="number"
            min="1"
            value={form.capacite}
            onChange={handleChange('capacite')}
            className={errors.capacite ? 'error' : ''}
          />
          {errors.capacite && <span className="form-error">{errors.capacite}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          rows="3"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="Description de l'événement"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <FaSave /> Enregistrer
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          <FaTimes /> Annuler
        </button>
      </div>
    </motion.form>
  );
}

export default function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent, getEventReservations } = useEvents();
  const [editing, setEditing] = useState(null); // null | 'new' | event id
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = (form) => {
    if (editing === 'new') {
      addEvent(form);
    } else {
      updateEvent(editing, form);
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteEvent(id);
    setDeleteConfirm(null);
  };

  const toggleReservations = (event) => {
    updateEvent(event.id, { reservationsOuvertes: !event.reservationsOuvertes });
  };

  return (
    <div className="admin-events">
      <div className="admin-page-header">
        <div>
          <h1>Gestion des événements</h1>
          <p>{events.length} événement{events.length > 1 ? 's' : ''}</p>
        </div>
        {editing === null && (
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <FaPlus /> Nouvel événement
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing !== null && (
          <EventForm
            key={editing}
            event={editing !== 'new' ? events.find((e) => e.id === editing) : null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      <div className="admin-events-list">
        {events.map((event) => {
          const resCount = getEventReservations(event.id).length;
          const resPersonnes = getEventReservations(event.id).reduce(
            (sum, r) => sum + (r.nbPersonnes || 1), 0
          );
          return (
            <motion.div
              key={event.id}
              className="admin-event-card"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="admin-event-card-body">
                <h3>{event.titre}</h3>
                <div className="admin-event-meta">
                  <span><FaCalendarAlt /> {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span><FaMapMarkerAlt /> {event.lieu}</span>
                  <span><FaUsers /> {resPersonnes}/{event.capacite} places</span>
                  <span className="admin-event-reservations">{resCount} réservation{resCount > 1 ? 's' : ''}</span>
                </div>
                <p>{event.description}</p>
              </div>

              <div className="admin-event-card-actions">
                <button
                  className={`admin-toggle-btn ${event.reservationsOuvertes ? 'active' : ''}`}
                  onClick={() => toggleReservations(event)}
                  title={event.reservationsOuvertes ? 'Fermer les réservations' : 'Ouvrir les réservations'}
                >
                  {event.reservationsOuvertes ? <FaToggleOn /> : <FaToggleOff />}
                  <span>{event.reservationsOuvertes ? 'Ouvert' : 'Fermé'}</span>
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setEditing(event.id)}
                >
                  <FaEdit /> Modifier
                </button>
                {deleteConfirm === event.id ? (
                  <div className="delete-confirm">
                    <span>Supprimer ?</span>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>Oui</button>
                    <button className="btn btn-sm btn-outline" onClick={() => setDeleteConfirm(null)}>Non</button>
                  </div>
                ) : (
                  <button
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => setDeleteConfirm(event.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
