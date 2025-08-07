// src/services/users/userService.js

import { HttpClient } from '../api/httpClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

class UserService {
    constructor() {
        this.httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');
    }

    /**
       * Obtener lista de usuarios con filtros y paginación
       * @param {Object} params - Parámetros de búsqueda y filtros
       * @param {string} params.search - Término de búsqueda
       * @param {string} params.role - Filtro por rol
       * @param {string} params.countryId - Filtro por país
       * @param {number} params.page - Página actual
       * @param {number} params.limit - Cantidad por página
       * @returns {Promise<Object>} Lista de usuarios y metadata
       */
    async getUsers(params = {}) {
        try {
            // Limpiar parámetros undefined/null para evitar enviarlos
            const cleanParams = this.cleanParams(params);

            const response = await this.httpClient.get(API_ENDPOINTS.USERS.LIST, {
                params: cleanParams
            });

            return this.formatUsersResponse(response);
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            throw this.handleError(error);
        }
    }

    /**
 * ✅ NUEVO: Actualizar rol de un usuario
 * @param {string} userId - ID del usuario a actualizar
 * @param {string} newRole - Nuevo rol (USER, ADMIN, SUPERADMIN)
 * @returns {Promise<Object>} Usuario actualizado
 */
    async updateUserRole(userId, newRole) {
        try {
            console.log(`🔄 Actualizando rol del usuario ${userId} a ${newRole}`);

            // Validaciones básicas
            if (!userId) {
                throw new Error('ID de usuario es requerido');
            }

            if (!newRole) {
                throw new Error('Nuevo rol es requerido');
            }

            const validRoles = ['USER', 'ADMIN', 'SUPERADMIN'];
            if (!validRoles.includes(newRole)) {
                throw new Error(`Rol no válido. Roles permitidos: ${validRoles.join(', ')}`);
            }

            // Realizar petición PUT
            const response = await this.httpClient.put(
                API_ENDPOINTS.USERS.UPDATE_ROLE(userId),
                { role: newRole }
            );

            if (!response.success) {
                throw new Error(response.message || 'Error al actualizar rol');
            }

            // Formatear usuario actualizado
            const updatedUser = this.formatSingleUser(response.data);

            console.log(`✅ Rol actualizado exitosamente: ${updatedUser.fullName} → ${newRole}`);

            return {
                success: true,
                data: updatedUser,
                message: response.message || `Rol actualizado exitosamente a ${newRole}`
            };

        } catch (error) {
            console.error('❌ Error al actualizar rol:', error);
            throw this.handleError(error);
        }
    }


    /**
   * Limpiar parámetros undefined/null
   * @param {Object} params - Parámetros originales
   * @returns {Object} Parámetros limpiados
   */
    cleanParams(params) {
        const cleaned = {};

        Object.keys(params).forEach(key => {
            const value = params[key];

            // Solo incluir valores que no sean undefined, null, o strings vacíos
            if (value !== undefined && value !== null && value !== '') {
                cleaned[key] = value;
            }
        });

        return cleaned;
    }

    /**
       * ✅ NUEVO: Formatear un usuario individual
       * @param {Object} user - Usuario del servidor
       * @returns {Object} Usuario formateado
       */
    formatSingleUser(user) {
        if (!user) return null;

        return {
            ...user,
            countries: Array.isArray(user.countries) ? user.countries : [],
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            fullName: `${user.nombre} ${user.apellido}`,
            countryNames: Array.isArray(user.countries)
                ? user.countries.map(c => c.nombre).join(', ')
                : ''
        };
    }

    /**
  * Formatear respuesta de usuarios para el frontend
  * @param {Object} response - Respuesta del servidor
  * @returns {Object} Respuesta formateada
  */
    formatUsersResponse(response) {
        if (!response.success) {
            throw new Error(response.message || 'Error al obtener usuarios');
        }

        // Formatear países si es necesario
        const formattedUsers = response.data.users.map(user => ({
            ...user,
            // Asegurar que countries sea un array
            countries: Array.isArray(user.countries) ? user.countries : [],
            // Formatear fecha de creación
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            // Agregar propiedades computadas
            fullName: `${user.nombre} ${user.apellido}`,
            countryNames: Array.isArray(user.countries)
                ? user.countries.map(c => c.nombre).join(', ')
                : ''
        }));

        return {
            ...response,
            data: {
                ...response.data,
                users: formattedUsers
            }
        };
    }

    /**
    * Manejo de errores centralizado
    * @param {Error} error - Error capturado
    * @returns {Error} Error formateado
    */
    handleError(error) {
        if (error.response) {
            // Error de respuesta del servidor
            const message = error.response.data?.message || 'Error en el servidor';
            const status = error.response.status;

            const formattedError = new Error(message);
            formattedError.status = status;
            formattedError.errors = error.response.data?.errors || [];

            return formattedError;
        } else if (error.request) {
            // Error de red
            const networkError = new Error('Error de conexión. Por favor verifica tu conexión a internet.');
            networkError.status = 0;
            return networkError;
        } else {
            // Error general
            const generalError = new Error(error.message || 'Error desconocido');
            generalError.status = 0;
            return generalError;
        }
    }
}

// Exportar instancia única (Singleton)
export const userService = new UserService();