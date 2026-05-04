import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnalytics } from '../utils/analytics/trackAnalytics';

/**
 * Place inside a React Router context. Emits `page_view` on pathname/search changes.
 */
const AnalyticsRouteTracker: React.FC = () => {
  const location = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (prevPath.current === path) {
      return;
    }
    prevPath.current = path;
    trackAnalytics({
      name: 'page_view',
      path,
      payload: { title: typeof document !== 'undefined' ? document.title : undefined },
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsRouteTracker;
