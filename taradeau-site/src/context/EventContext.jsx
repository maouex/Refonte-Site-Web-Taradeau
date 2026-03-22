import { createContext, useContext, useState, useCallback } from 'react';
import { evenements as defaultEvents } from '../data/siteData';

const EventContext = createContext();

const EVENTS_KEY = 'taradeau-events';
const RESERVATIONS_KEY = 'taradeau-reservations';

function loadEvents() {
  try {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Initialize from siteData with extra fields
  return defaultEvents.map((e, i) => ({
    ...e,
    id: `evt-${i}`,
    capacite: 100,
    reservationsOuvertes: true,
  }));
}

function loadReservations() {
  try {
    const saved = localStorage.getItem(RESERVATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function saveReservations(reservations) {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

export function EventProvider({ children }) {
  const [events, setEvents] = useState(loadEvents);
  const [reservations, setReservations] = useState(loadReservations);

  // CRUD Events
  const addEvent = useCallback((event) => {
    const newEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      reservationsOuvertes: true,
    };
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      saveEvents(updated);
      return updated;
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      saveEvents(updated);
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEvents(updated);
      return updated;
    });
    // Also delete associated reservations
    setReservations((prev) => {
      const updated = prev.filter((r) => r.eventId !== id);
      saveReservations(updated);
      return updated;
    });
  }, []);

  // Reservations
  const addReservation = useCallback((reservation) => {
    const newRes = {
      ...reservation,
      id: `res-${Date.now()}`,
      date: new Date().toISOString(),
      statut: 'confirmee',
    };
    setReservations((prev) => {
      const updated = [...prev, newRes];
      saveReservations(updated);
      return updated;
    });
    return newRes;
  }, []);

  const cancelReservation = useCallback((id) => {
    setReservations((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, statut: 'annulee' } : r
      );
      saveReservations(updated);
      return updated;
    });
  }, []);

  const deleteReservation = useCallback((id) => {
    setReservations((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveReservations(updated);
      return updated;
    });
  }, []);

  const getEventReservations = useCallback(
    (eventId) => reservations.filter((r) => r.eventId === eventId && r.statut !== 'annulee'),
    [reservations]
  );

  const getEventPlacesRestantes = useCallback(
    (eventId) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return 0;
      const taken = getEventReservations(eventId).reduce((sum, r) => sum + (r.nbPersonnes || 1), 0);
      return Math.max(0, event.capacite - taken);
    },
    [events, getEventReservations]
  );

  return (
    <EventContext.Provider
      value={{
        events,
        reservations,
        addEvent,
        updateEvent,
        deleteEvent,
        addReservation,
        cancelReservation,
        deleteReservation,
        getEventReservations,
        getEventPlacesRestantes,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within EventProvider');
  return context;
}
