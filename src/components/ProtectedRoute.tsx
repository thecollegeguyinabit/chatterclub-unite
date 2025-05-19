
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user === null) {
      // Only redirect if we're not loading and the user is explicitly null (not authenticated)
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clubify-600"></div>
      </div>
    );
  }

  // If authenticated, render the child route
  return user ? <Outlet /> : null;
};
