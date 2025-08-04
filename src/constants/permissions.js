// src/config/permissions.js

/**
 * Definición de permisos del sistema (igual que en el backend)
 */
export const PERMISSIONS = {
  // Permisos de RMA
  RMA: {
    CREATE: 'rma:create',
    READ_OWN: 'rma:read_own',
    READ_ALL: 'rma:read_all',
    UPDATE_OWN: 'rma:update_own',
    UPDATE_ALL: 'rma:update_all',
    DELETE: 'rma:delete',
    CHANGE_STATUS: 'rma:change_status',
    ASSIGN_TRACKING: 'rma:assign_tracking',
    ADD_EVALUATION: 'rma:add_evaluation',
    MANAGE_QUOTES: 'rma:manage_quotes'
  },

  // Permisos de Usuarios
  USER: {
    CREATE: 'user:create',
    READ_OWN: 'user:read_own',
    READ_ALL: 'user:read_all',
    UPDATE_OWN: 'user:update_own',
    UPDATE_ALL: 'user:update_all',
    DELETE: 'user:delete',
    MANAGE_ROLES: 'user:manage_roles',
    ASSIGN_COUNTRIES: 'user:assign_countries'
  },

  // Permisos de Productos
  PRODUCT: {
    CREATE: 'product:create',
    READ: 'product:read',
    UPDATE: 'product:update',
    DELETE: 'product:delete',
    MANAGE_AVAILABILITY: 'product:manage_availability'
  },

  // Permisos de Marcas
  BRAND: {
    CREATE: 'brand:create',
    READ: 'brand:read',
    UPDATE: 'brand:update',
    DELETE: 'brand:delete',
    MANAGE_COUNTRIES: 'brand:manage_countries'
  },

  // Permisos de Países
  COUNTRY: {
    CREATE: 'country:create',
    READ: 'country:read',
    UPDATE: 'country:update',
    DELETE: 'country:delete'
  }
};

// Primero definimos los permisos base de USER
const USER_PERMISSIONS = [
  // RMA - Solo puede gestionar sus propios RMAs
  PERMISSIONS.RMA.CREATE,
  PERMISSIONS.RMA.READ_OWN,
  PERMISSIONS.RMA.UPDATE_OWN,
  
  // Usuario - Solo puede ver y actualizar su perfil
  PERMISSIONS.USER.READ_OWN,
  PERMISSIONS.USER.UPDATE_OWN,
  
  // Productos y Marcas - Solo lectura
  PERMISSIONS.PRODUCT.READ,
  PERMISSIONS.BRAND.READ,
  PERMISSIONS.COUNTRY.READ
];

// Luego definimos los permisos adicionales de ADMIN
const ADMIN_ADDITIONAL_PERMISSIONS = [
  // RMA - Puede gestionar todos los RMAs de su país
  PERMISSIONS.RMA.READ_ALL,
  PERMISSIONS.RMA.UPDATE_ALL,
  PERMISSIONS.RMA.CHANGE_STATUS,
  PERMISSIONS.RMA.ASSIGN_TRACKING,
  PERMISSIONS.RMA.ADD_EVALUATION,
  PERMISSIONS.RMA.MANAGE_QUOTES,
  
  // Usuarios - Puede gestionar usuarios
  PERMISSIONS.USER.READ_ALL,
  PERMISSIONS.USER.CREATE,
  
  // Productos - Gestión básica
  PERMISSIONS.PRODUCT.CREATE,
  PERMISSIONS.PRODUCT.UPDATE,
  
  // Marcas - Gestión básica
  PERMISSIONS.BRAND.CREATE,
  PERMISSIONS.BRAND.UPDATE
];

/**
 * Definición de permisos por rol
 */
export const ROLE_PERMISSIONS = {
  USER: USER_PERMISSIONS,
  
  ADMIN: [
    ...USER_PERMISSIONS,
    ...ADMIN_ADDITIONAL_PERMISSIONS
  ],

  SUPERADMIN: [
    // Tiene TODOS los permisos
    ...Object.values(PERMISSIONS).flatMap(group => Object.values(group))
  ]
};

/**
 * Funciones auxiliares para verificar permisos
 */
export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role, permissions) {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role, permissions) {
  return permissions.every(permission => hasPermission(role, permission));
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}