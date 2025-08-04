import { HttpClient } from "../api/httpClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export class RmaListService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Obtiene todos los RMAs del usuario autenticado
   * @param {Object} filters - Filtros opcionales (status, startDate, endDate)
   * @returns {Promise<Array>} Lista de RMAs
   */
  async getAll(filters = {}) {
    try {
      // Construir query params basados en los filtros
      const params = this.buildQueryParams(filters);
      
      // Hacer la petición GET
      const response = await this.httpClient.get(API_ENDPOINTS.RMA.LIST, { params });
      
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Construye los parámetros de consulta para los filtros
   * @param {Object} filters 
   * @returns {Object} Objeto con los query params
   */
  buildQueryParams(filters) {
    const { status, startDate, endDate } = filters;
    const params = {};

    if (status) params.status = status;
    if (startDate) params.startDate = new Date(startDate).toISOString();
    if (endDate) params.endDate = new Date(endDate).toISOString();

    return params;
  }

  /**
   * Maneja la respuesta del servidor
   * @param {Object} response 
   * @returns {Array} Datos de los RMAs
   */
  handleResponse(response) {
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch RMAs");
    }
    return response.data;
  }

  /**
   * Maneja errores de la petición
   * @param {Error} error 
   * @returns {Error} Error procesado
   */
  handleError(error) {
    console.error("RMA list error:", error);
    const message = error.response?.data?.message || error.message || "Unknown error occurred while fetching RMAs";
    return new Error(message);
  }
}

// Factory function para inyección de dependencias
export const rmaListService = (baseUrl) => {
  const httpClient = new HttpClient(baseUrl);
  return new RmaListService(httpClient);
};