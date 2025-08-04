import { usePermissions } from "../../hooks/usePermissions";

/**
 * Componente que muestra/oculta contenido basado en permisos
 * 
 * @param {Object} props
 * @param {string} props.permission - Permiso requerido
 * @param {string[]} props.anyPermissions - Cualquiera de estos permisos
 * @param {string[]} props.allPermissions - Todos estos permisos
 * @param {string} props.role - Rol requerido
 * @param {string[]} props.anyRoles - Cualquiera de estos roles
 * @param {React.ReactNode} props.children - Contenido a proteger
 * @param {React.ReactNode} props.fallback - Contenido alternativo
 */

export function ProtectedComponent({ 
  permission,
  anyPermissions,
  allPermissions,
  role,
  anyRoles,
  children, 
  fallback = null 
}) {
  const { can, canAny, canAll, isRole, isAnyRole } = usePermissions();

  // Verificar permisos
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

  return hasAccess ? children : fallback;
}

/**
 * Variante que renderiza si NO tiene el permiso
 */
export function UnlessProtected(props) {
  const { can, canAny, canAll, isRole, isAnyRole } = usePermissions();
  
  let hasAccess = true;

  if (props.permission) {
    hasAccess = !can(props.permission);
  } else if (props.anyPermissions) {
    hasAccess = !canAny(...props.anyPermissions);
  } else if (props.allPermissions) {
    hasAccess = !canAll(...props.allPermissions);
  } else if (props.role) {
    hasAccess = !isRole(props.role);
  } else if (props.anyRoles) {
    hasAccess = !isAnyRole(...props.anyRoles);
  }

  return hasAccess ? props.children : props.fallback || null;
}