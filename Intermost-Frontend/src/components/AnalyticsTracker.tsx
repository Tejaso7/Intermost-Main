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

    const trackPageview = async () => {
      try {
        await analyticsApi.trackPageview({
          url: pathname,
          title: document.title,
          referrer: document.referrer,
          session_id: getSessionId(),
        });
      } catch (error) {
        // Silently fail - don't break the app if tracking fails
        console.debug('Analytics tracking failed:', error);
      }
    };

    // Small delay to ensure the page has loaded
    const timer = setTimeout(trackPageview, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
