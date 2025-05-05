import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// This component protects admin routes
const AdminRouteGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => { 
    const adminAuth = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(adminAuth === 'true');
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default AdminRouteGuard;