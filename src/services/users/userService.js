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
      const queryParams = new URLSearchParams();
      console.log(params,"params")
      // Agregar parámetros solo si tienen valor
    //   if (params.search) queryParams.append('search', params.search);
    //   if (params.role && params.role !== 'ALL') queryParams.append('role', params.role);
    //   if (params.countryId && params.countryId !== 'ALL') queryParams.append('countryId', params.countryId);
    //   if (params.page) queryParams.append('page', params.page);
    //   if (params.limit) queryParams.append('limit', params.limit);
    const response = await this.httpClient.get(API_ENDPOINTS.USERS.LIST, { params });
      console.log("response services", response)
      
      return response;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw this.handleError(error);
    }
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
      
      return {
        message,
        status,
        errors: error.response.data?.errors || []
      };
    } else if (error.request) {
      // Error de red
      return {
        message: 'Error de conexión. Por favor verifica tu conexión a internet.',
        status: 0
      };
    } else {
      // Error general
      return {
        message: error.message || 'Error desconocido',
        status: 0
      };
    }
  }
}

// Exportar instancia única (Singleton)
export const userService = new UserService();