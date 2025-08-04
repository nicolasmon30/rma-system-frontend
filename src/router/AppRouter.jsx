import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/auth/AuthContext';
import { ROUTES } from '../constants/routes';
import { PERMISSIONS } from '../constants/permissions';

// Layouts
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../components/auth/ProfilePage';
import { PasswordPage } from '../pages/PasswordPage';
import { AppInitializer } from '../components/layout/AppInitializer';
import UserPage from '../pages/UserPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInitializer>
          <Routes>
            {/* Rutas públicas (Auth) */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="password" element={<PasswordPage />} />
              
              {/* User Management - Solo ADMIN y SUPERADMIN */}
              <Route 
                path="users"
                element={
                  <ProtectedRoute
                    permission={PERMISSIONS.USER.READ_ALL}
                    anyRoles={['ADMIN', 'SUPERADMIN']}
                  >
                    <UserPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirects para compatibilidad */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </AppInitializer>
      </AuthProvider>
    </BrowserRouter>
  );
}