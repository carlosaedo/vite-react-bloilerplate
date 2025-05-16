// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // contains user.role

  if (!user) return <Navigate to='/login' replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to='/unauthorized' replace />;

  return <Outlet />;
};

export default PrivateRoute;
