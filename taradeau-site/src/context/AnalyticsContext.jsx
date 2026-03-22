import { createContext, useContext, useState, useCallback } from 'react';

const AnalyticsContext = createContext();

const ANALYTICS_KEY = 'taradeau-analytics';

function loadAnalytics() {
  try {
    const saved = localStorage.getItem(ANALYTICS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { pageViews: [], events: [] };
}

function saveAnalytics(data) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch {}
}

export function AnalyticsProvider({ children }) {
  const [analytics, setAnalytics] = useState(loadAnalytics);

  const trackPageView = useCallback((path) => {
    setAnalytics((prev) => {
      const updated = {
        ...prev,
        pageViews: [
          ...prev.pageViews,
          { path, timestamp: new Date().toISOString() },
        ],
      };
      saveAnalytics(updated);
      return updated;
    });
  }, []);

  const trackEvent = useCallback((type, label) => {
    setAnalytics((prev) => {
      const updated = {
        ...prev,
        events: [
          ...prev.events,
          { type, label, timestamp: new Date().toISOString() },
        ],
      };
      saveAnalytics(updated);
      return updated;
    });
  }, []);

  const getStats = useCallback(() => {
    const { pageViews, events } = analytics;

    const totalViews = pageViews.length;

    // Views grouped by page path
    const viewsByPage = {};
    pageViews.forEach(({ path }) => {
      viewsByPage[path] = (viewsByPage[path] || 0) + 1;
    });

    // Views by day for the last 30 days
    const viewsByDay = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      viewsByDay[key] = 0;
    }
    pageViews.forEach(({ timestamp }) => {
      const key = timestamp.slice(0, 10);
      if (key in viewsByDay) {
        viewsByDay[key]++;
      }
    });

    // Top pages sorted by count descending
    const topPages = Object.entries(viewsByPage)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    return { totalViews, viewsByPage, viewsByDay, topPages, events };
  }, [analytics]);

  return (
    <AnalyticsContext.Provider
      value={{ trackPageView, trackEvent, getStats, analytics }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context)
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  return context;
}
