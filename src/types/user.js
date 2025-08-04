/**
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} email - Email del usuario
 * @property {string} empresa - Empresa del usuario
 * @property {string} direccion - Dirección del usuario
 * @property {string} telefono - Teléfono del usuario
 * @property {string} role - Rol del usuario
 * @property {Array<Country>} countries - Países asignados al usuario
 * @property {string} createdAt - Fecha de creación
 * @property {string} updatedAt - Fecha de última actualización
 */

/**
 * @typedef {Object} Country
 * @property {string} id - ID único del país
 * @property {string} nombre - Nombre del país
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} direccion - Dirección del usuario
 * @property {string} telefono - Teléfono del usuario
 * @property {string} empresa - Empresa del usuario
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 * @property {string} countryId - ID del país seleccionado
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - Email del usuario
 * @property {string} password - Contraseña del usuario
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Indica si la operación fue exitosa
 * @property {Object} data - Datos de la respuesta
 * @property {User} data.user - Datos del usuario
 * @property {string} data.token - Token de autenticación
 * @property {string} message - Mensaje de la respuesta
 */