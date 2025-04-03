// client/src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!user.email_confirmed_at) {
    return <Navigate to='/confirmaton-prompt' replace />;
  }

  return children;

};

export default ProtectedRoute;