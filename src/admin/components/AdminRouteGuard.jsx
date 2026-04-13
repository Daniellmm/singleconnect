import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase';

// Refresh the session this many minutes before it expires.
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const AdminRouteGuard = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'auth' | 'unauth'
  const refreshTimer = useRef(null);

  /** Schedule a proactive token refresh so the session never expires mid-use. */
  const scheduleRefresh = (session) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    if (!session?.expires_at) return;

    const expiresInMs = session.expires_at * 1000 - Date.now();
    const refreshInMs = Math.max(expiresInMs - REFRESH_BEFORE_EXPIRY_MS, 0);

    refreshTimer.current = setTimeout(async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        // Refresh failed — force re-login
        setStatus('unauth');
      } else {
        scheduleRefresh(data.session); // reschedule for the new token
      }
    }, refreshInMs);
  };

  useEffect(() => {
    // Check initial session and kick off the first refresh timer
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'auth' : 'unauth');
      if (session) scheduleRefresh(session);
    });

    // React to sign-in / sign-out / token-refreshed events (including other tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setStatus(session ? 'auth' : 'unauth');
        if (session) scheduleRefresh(session);
      }
    );

    return () => {
      subscription.unsubscribe();
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRouteGuard;
