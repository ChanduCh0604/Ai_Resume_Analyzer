
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  const location = useLocation();
  const userId = sessionStorage.getItem('userId');

  if (!userId) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;