import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  if (!userRole) return <Navigate to='/login' replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to='/unauthorized' replace />;

  return <Outlet />;
};

export default PrivateRoute;
