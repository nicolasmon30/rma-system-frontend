import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { ROUTES } from '../../constants/routes';

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="auth-layout font-poppins">
      <div className="auth-container">
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}