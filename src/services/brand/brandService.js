// src/services/brands/brandService.js
import { HttpClient } from '../api/httpClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export class BrandService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Obtener todas las marcas con filtros
     * @param {Object} params - Parámetros de búsqueda
     * @returns {Promise<Object>} Lista de marcas y paginación
     */
    async getAllBrands(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.search) {
                queryParams.append('search', params.search);
            }
            if (params.page) {
                queryParams.append('page', params.page);
            }
            if (params.limit) {
                queryParams.append('limit', params.limit);
            }

            const url = `${API_ENDPOINTS.BRAND.LIST}${queryParams.toString() ? `?${queryParams}` : ''}`;
            console.log("Fetching brands from:", url);
            
            const response = await this.httpClient.get(url);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener una marca por ID
     * @param {string} brandId - ID de la marca
     * @returns {Promise<Object>} Datos de la marca
     */
    async getBrandById(brandId) {
        try {
            console.log("Getting brand:", brandId);
            
            const response = await this.httpClient.get(
                API_ENDPOINTS.BRAND.GET_BY_ID(brandId)
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Crear nueva marca
     * @param {Object} brandData - Datos de la marca
     * @returns {Promise<Object>} Marca creada
     */
    async createBrand(brandData) {
        try {
            console.log("Creating brand:", brandData);
            
            const response = await this.httpClient.post(
                API_ENDPOINTS.BRAND.CREATE,
                brandData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar marca
     * @param {string} brandId - ID de la marca
     * @param {Object} brandData - Datos actualizados
     * @returns {Promise<Object>} Marca actualizada
     */
    async updateBrand(brandId, brandData) {
        try {
            console.log("Updating brand:", brandId, brandData);
            
            const response = await this.httpClient.put(
                API_ENDPOINTS.BRAND.UPDATE(brandId),
                brandData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Eliminar marca
     * @param {string} brandId - ID de la marca
     * @returns {Promise<Object>} Resultado de la eliminación
     */
    async deleteBrand(brandId) {
        try {
            console.log("Deleting brand:", brandId);
            
            const response = await this.httpClient.delete(
                API_ENDPOINTS.BRAND.DELETE(brandId)
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Buscar marcas
     * @param {string} searchTerm - Término de búsqueda
     * @param {Object} options - Opciones adicionales
     * @returns {Promise<Array>} Lista de marcas encontradas
     */
    async searchBrands(searchTerm, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('q', searchTerm);
            
            if (options.limit) {
                queryParams.append('limit', options.limit);
            }

            const response = await this.httpClient.get(
                `${API_ENDPOINTS.BRAND.SEARCH}?${queryParams}`
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener estadísticas de marcas
     * @returns {Promise<Object>} Estadísticas
     */
    async getBrandStats() {
        try {
            const response = await this.httpClient.get(API_ENDPOINTS.BRAND.STATS);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleResponse(response) {
        if (!response.success) {
            throw new Error(response.message || "Error en la operación");
        }
        return response.data;
    }

    handleError(error) {
        console.error("BrandService error:", error);
        const message = error.response?.data?.message || error.message || "Error desconocido";
        return new Error(message);
    }
}

// Factory function para crear instancia del servicio
export const brandService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new BrandService(httpClient);
};