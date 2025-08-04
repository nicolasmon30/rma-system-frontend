import { useMemo } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRolePermissions,
    PERMISSIONS
} from '../constants/permissions';

/**
 * Hook personalizado para manejar permisos
 */
export function usePermissions() {
  const { user } = useAuth();
  
  const permissions = useMemo(() => {
    if (!user) return [];
    return getRolePermissions(user.role);
  }, [user]);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const can = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  /**
   * Verifica si el usuario tiene alguno de los permisos
   */
  const canAny = (...permissions) => {
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
  };

  /**
   * Verifica si el usuario tiene todos los permisos
   */
  const canAll = (...permissions) => {
    if (!user) return false;
    return hasAllPermissions(user.role, permissions);
  };

  /**
   * Verifica si es un rol específico
   */
  const isRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  /**
   * Verifica si es alguno de los roles especificados
   */
  const isAnyRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  /**
   * Obtiene todos los permisos del usuario actual
   */
  const getAllPermissions = () => {
    if (!user) return [];
    return permissions;
  };

  return {
    // Funciones de verificación
    can,
    canAny,
    canAll,
    isRole,
    isAnyRole,
    
    // Datos
    permissions,
    userRole: user?.role || null,
    getAllPermissions,
    
    // Constantes de permisos (para fácil acceso)
    PERMISSIONS
  };
}