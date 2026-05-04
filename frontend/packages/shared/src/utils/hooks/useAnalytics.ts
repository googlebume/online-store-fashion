import { useCallback } from 'react';
import { trackAnalytics, type TrackPayload } from '../analytics/trackAnalytics';

/**
 * Returns a stable `track` function for custom events (same behaviour as `trackAnalytics`).
 */
export function useAnalytics() {
  const track = useCallback((payload: TrackPayload) => {
    trackAnalytics(payload);
  }, []);

  return { track };
}
