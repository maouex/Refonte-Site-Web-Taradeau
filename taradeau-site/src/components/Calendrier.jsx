import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { useEvents } from '../context/EventContext';

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const CATEGORIES = [
  { key: 'all', label: 'Tous', color: 'var(--or-accent)' },
  { key: 'Vie communale', label: 'Vie communale', color: 'var(--bleu-nuit)' },
  { key: 'Manifestations', label: 'Manifestations', color: 'var(--rouge-provencal)' },
  { key: 'Jeunesse', label: 'Jeunesse', color: '#2ecc71' },
  { key: 'Tourisme', label: 'Tourisme', color: 'var(--or-accent)' },
  { key: 'Autre', label: 'Autre', color: 'var(--gris-bleute)' },
];

function getCategoryColor(categorie) {
  const cat = CATEGORIES.find((c) => c.key === categorie);
  return cat ? cat.color : 'var(--or-accent)';
}

function getEventCategory(event) {
  if (event.categorie) return event.categorie;
  return 'Autre';
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
  return day === 0 ? 6 : day - 1;
}

function formatDateISO(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const monthVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
};

const popupVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95 },
};

/* ─── styles ─── */
const styles = {
  wrapper: {
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    maxWidth: 900,
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  headerIcon: {
    color: 'var(--rouge-provencal)',
    fontSize: '1.5rem',
  },
  headerTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  filterBtn: (active, color) => ({
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    border: `2px solid ${color}`,
    background: active ? color : 'transparent',
    color: active ? '#fff' : color,
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  }),
  calendarCard: {
    background: 'var(--bg-card)',
    borderRadius: '1rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    background: 'var(--bleu-nuit)',
    color: '#fff',
  },
  navBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  navLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    fontWeight: 700,
    minWidth: 200,
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 0,
  },
  dayHeader: {
    padding: '0.6rem 0',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border-color)',
  },
  dayCell: (isToday, hasEvents, isCurrentMonth) => ({
    position: 'relative',
    padding: '0.5rem 0.25rem',
    minHeight: 52,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    cursor: hasEvents ? 'pointer' : 'default',
    background: isToday
      ? 'rgba(232, 78, 59, 0.08)'
      : hasEvents
        ? 'rgba(201, 168, 76, 0.04)'
        : 'transparent',
    borderBottom: '1px solid var(--border-color)',
    borderRight: '1px solid var(--border-color)',
    transition: 'background 0.2s',
    opacity: isCurrentMonth ? 1 : 0.35,
  }),
  dayNumber: (isToday) => ({
    fontSize: '0.85rem',
    fontWeight: isToday ? 800 : 500,
    color: isToday ? 'var(--rouge-provencal)' : 'var(--text-primary)',
    width: isToday ? 28 : 'auto',
    height: isToday ? 28 : 'auto',
    lineHeight: isToday ? '28px' : 'normal',
    textAlign: 'center',
    borderRadius: '50%',
    background: isToday ? 'rgba(232, 78, 59, 0.15)' : 'transparent',
  }),
  dots: {
    display: 'flex',
    gap: '3px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  dot: (color) => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  popup: {
    background: 'var(--bg-card)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border-color)',
    maxWidth: 460,
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  popupHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
    color: 'var(--text-primary)',
  },
  popupClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '0.25rem',
    lineHeight: 1,
  },
  popupBody: {
    padding: '1rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  eventCard: (color) => ({
    padding: '1rem',
    borderRadius: '0.75rem',
    background: 'var(--bg-secondary)',
    borderLeft: `4px solid ${color}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  }),
  eventTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  eventMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  eventBadge: (color) => ({
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#fff',
    background: color,
    borderRadius: '999px',
    padding: '0.15rem 0.55rem',
    marginTop: '0.25rem',
    alignSelf: 'flex-start',
  }),
  todayBtn: {
    padding: '0.35rem 0.8rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'var(--font-body)',
  },
};

export default function Calendrier() {
  const { events } = useEvents();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Build a map of date -> events
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((evt) => {
      const cat = getEventCategory(evt);
      if (activeFilter !== 'all' && cat !== activeFilter) return;
      const key = evt.date; // ISO "YYYY-MM-DD"
      if (!map[key]) map[key] = [];
      map[key].push(evt);
    });
    return map;
  }, [events, activeFilter]);

  // Available categories (only those that have events)
  const availableCategories = useMemo(() => {
    const cats = new Set(events.map(getEventCategory));
    return CATEGORIES.filter((c) => c.key === 'all' || cats.has(c.key));
  }, [events]);

  const navigateMonth = useCallback((dir) => {
    setDirection(dir);
    setCurrentMonth((prev) => {
      const next = prev + dir;
      if (next < 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      if (next > 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setDirection(0);
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const calendarDays = useMemo(() => {
    const days = [];
    // trailing days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({ day: d, month: m, year: y, currentMonth: false });
    }
    // days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, month: currentMonth, year: currentYear, currentMonth: true });
    }
    // fill remaining slots to complete 6-row grid (42 cells) or up to full rows
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = currentMonth === 11 ? 0 : currentMonth + 1;
        const y = currentMonth === 11 ? currentYear + 1 : currentYear;
        days.push({ day: d, month: m, year: y, currentMonth: false });
      }
    }
    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDay, prevMonthDays]);

  const isToday = (day, month, year) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const handleDateClick = (dateISO) => {
    if (eventsByDate[dateISO]) {
      setSelectedDate(dateISO);
    }
  };

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const formatSelectedDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MOIS[m - 1]} ${y}`;
  };

  return (
    <div style={styles.wrapper}>
      {/* Title */}
      <div style={styles.header}>
        <FaCalendarAlt style={styles.headerIcon} />
        <h2 style={styles.headerTitle}>Calendrier des événements</h2>
      </div>

      {/* Category filters */}
      {availableCategories.length > 2 && (
        <div style={styles.filters}>
          {availableCategories.map((cat) => (
            <button
              key={cat.key}
              style={styles.filterBtn(activeFilter === cat.key, cat.color)}
              onClick={() => setActiveFilter(cat.key)}
              onMouseEnter={(e) => {
                if (activeFilter !== cat.key) {
                  e.currentTarget.style.background = cat.color;
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = cat.color;
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Calendar */}
      <div style={styles.calendarCard}>
        {/* Navigation */}
        <div style={styles.nav}>
          <button
            style={styles.navBtn}
            onClick={() => navigateMonth(-1)}
            aria-label="Mois précédent"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <FaChevronLeft />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={`${currentYear}-${currentMonth}`}
                custom={direction}
                variants={monthVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={styles.navLabel}
              >
                {MOIS[currentMonth]} {currentYear}
              </motion.span>
            </AnimatePresence>
            <button
              style={styles.todayBtn}
              onClick={goToToday}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              Aujourd&apos;hui
            </button>
          </div>

          <button
            style={styles.navBtn}
            onClick={() => navigateMonth(1)}
            aria-label="Mois suivant"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Day headers */}
        <div style={styles.grid}>
          {JOURS.map((j) => (
            <div key={j} style={styles.dayHeader}>{j}</div>
          ))}
        </div>

        {/* Calendar grid with animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            custom={direction}
            variants={monthVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={styles.grid}
          >
            {calendarDays.map((cell, idx) => {
              const dateISO = formatDateISO(cell.year, cell.month, cell.day);
              const dayEvents = eventsByDate[dateISO] || [];
              const hasEvents = dayEvents.length > 0;
              const todayFlag = isToday(cell.day, cell.month, cell.year);

              return (
                <motion.div
                  key={idx}
                  style={styles.dayCell(todayFlag, hasEvents, cell.currentMonth)}
                  onClick={() => cell.currentMonth && handleDateClick(dateISO)}
                  whileHover={hasEvents && cell.currentMonth ? { background: 'rgba(201, 168, 76, 0.12)' } : {}}
                  whileTap={hasEvents && cell.currentMonth ? { scale: 0.95 } : {}}
                >
                  <span style={styles.dayNumber(todayFlag && cell.currentMonth)}>
                    {cell.day}
                  </span>
                  {hasEvents && cell.currentMonth && (
                    <div style={styles.dots}>
                      {dayEvents.slice(0, 3).map((evt, i) => (
                        <span key={i} style={styles.dot(getCategoryColor(getEventCategory(evt)))} />
                      ))}
                      {dayEvents.length > 3 && (
                        <span style={{
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          lineHeight: 1,
                        }}>
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Event detail popup */}
      <AnimatePresence>
        {selectedDate && selectedEvents.length > 0 && (
          <motion.div
            style={styles.popupOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              style={styles.popup}
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.popupHeader}>
                <h3 style={styles.popupTitle}>
                  {formatSelectedDate(selectedDate)}
                </h3>
                <button
                  style={styles.popupClose}
                  onClick={() => setSelectedDate(null)}
                  aria-label="Fermer"
                >
                  &times;
                </button>
              </div>
              <div style={styles.popupBody}>
                {selectedEvents.map((evt) => {
                  const cat = getEventCategory(evt);
                  const color = getCategoryColor(cat);
                  return (
                    <div key={evt.id} style={styles.eventCard(color)}>
                      <h4 style={styles.eventTitle}>{evt.titre}</h4>
                      {evt.lieu && (
                        <span style={styles.eventMeta}>
                          📍 {evt.lieu}
                        </span>
                      )}
                      {evt.description && (
                        <span style={styles.eventMeta}>{evt.description}</span>
                      )}
                      {evt.capacite && (
                        <span style={styles.eventMeta}>
                          Places : {evt.capacite}
                          {evt.reservationsOuvertes && ' — Réservations ouvertes'}
                        </span>
                      )}
                      {cat !== 'Autre' && (
                        <span style={styles.eventBadge(color)}>{cat}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
