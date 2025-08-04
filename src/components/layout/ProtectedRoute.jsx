import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROUTES } from '../../constants/routes';

/**
 * Componente para proteger rutas con autenticación y permisos
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar
 * @param {string} props.permission - Permiso requerido
 * @param {string[]} props.anyPermissions - Cualquiera de estos permisos
 * @param {string[]} props.allPermissions - Todos estos permisos
 * @param {string} props.role - Rol requerido
 * @param {string[]} props.anyRoles - Cualquiera de estos roles
 * @param {string} props.redirectTo - Ruta de redirección (default: /auth/login)
 * @param {React.ReactNode} props.fallback - Componente a mostrar si no tiene permisos
 */
export function ProtectedRoute({  // CAMBIO AQUÍ: Desestructuración de props
  children,
  permission,
  anyPermissions,
  allPermissions,
  role,
  anyRoles,
  redirectTo = '/auth/login',
  fallback
}) {  // CAMBIO AQUÍ: Cerrar llave de desestructuración
  const { isAuthenticated, isInitializing } = useAuth();
  const { can, canAny, canAll, isRole, isAnyRole } = usePermissions();

  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  // if (isLoading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner">
  //         <div className="spinner"></div>
  //         <p>Verificando autenticación...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (isInitializing) {
    return null; // O un loader minimalista
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no se especifican permisos, solo verificar autenticación
  if (!permission && !anyPermissions && !allPermissions && !role && !anyRoles) {
    return <>{children}</>; 
  }

  let hasAccess = true;

  if (permission) {
    hasAccess = can(permission);
  } else if (anyPermissions) {
    hasAccess = canAny(...anyPermissions);
  } else if (allPermissions) {
    hasAccess = canAll(...allPermissions);
  } else if (role) {
    hasAccess = isRole(role);
  } else if (anyRoles) {
    hasAccess = isAnyRole(...anyRoles);
  }

  // Si no tiene acceso
  if (!hasAccess) {
    // Si hay un componente fallback, mostrarlo
    if (fallback) {
      return <>{fallback}</>; 
    }
    
    // Si no, mostrar página de acceso denegado
    return <AccessDenied />;
  }

  return <>{children}</>;
}

/**
 * Componente de acceso denegado por defecto
 */
function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No tienes permisos para acceder a esta página
          </p>
        </div>
        <div className="mt-5">
          <a
            href="/dashboard"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}