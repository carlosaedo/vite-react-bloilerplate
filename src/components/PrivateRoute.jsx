import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import { CircularProgress } from '@mui/material';

const PrivateRoute = ({ allowedRoles }) => {
  const { userRole, loadingAuth } = useAuth();

  if (loadingAuth) return <CircularProgress />;

  if (!userRole) return <Navigate to='/login' replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to='/unauthorized' replace />;

  return <Outlet />;
};

export default PrivateRoute;
