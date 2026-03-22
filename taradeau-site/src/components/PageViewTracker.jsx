import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';

export default function PageViewTracker() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
}
