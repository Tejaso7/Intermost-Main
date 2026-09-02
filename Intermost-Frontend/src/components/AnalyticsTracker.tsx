'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsApi } from '@/lib/services';

// Generate a unique session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('intermost_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('intermost_session_id', sessionId);
  }
  return sessionId;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;
    
    // Prevent duplicate tracking
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const trackPageview = () => {
      const payload = {
        url: pathname,
        title: document.title,
        referrer: document.referrer,
        session_id: getSessionId(),
      };

      // Try sendBeacon for non-blocking browser background sending
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          const sent = navigator.sendBeacon('/api/v1/analytics/track/', blob);
          if (sent) return;
        } catch (e) {
          // Fallback to async API call
        }
      }

      analyticsApi.trackPageview(payload).catch((error) => {
        console.debug('Analytics tracking failed:', error);
      });
    };

    // Schedule during browser idle time to never block main thread page rendering
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(trackPageview, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(trackPageview, 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
