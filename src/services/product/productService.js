// src/services/brands/brandService.js
import { HttpClient } from '../api/httpClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export class ProductService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Obtener todos los productos con filtros
     * @param {Object} params - Parámetros de búsqueda
     * @returns {Promise<Object>} Lista de productos y paginación
     */
    async getProducts(params = {}) {
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

            const url = `${API_ENDPOINTS.PRODUCT.LIST}${queryParams.toString() ? `?${queryParams}` : ''}`;
            console.log("Fetching products from:", url);
            
            const response = await this.httpClient.get(url);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Obtener un producto por ID
     * @param {string} productId - ID del producto
     * @returns {Promise<Object>} Datos del producto
     */
    async getProductById(productId) {
        try {
            console.log("Getting product:", productId);
            
            const response = await this.httpClient.get(
                API_ENDPOINTS.PRODUCT.GET_BY_ID(productId)
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Crear producrto
     * @param {Object} productData - Datos del producto
     * @returns {Promise<Object>} Producto creado
     */
    async createProduct(productData) {
        try {
            console.log("Creating product:", productData);
            
            const response = await this.httpClient.post(
                API_ENDPOINTS.PRODUCT.CREATE,
                productData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar producto
     * @param {string} productId - ID de la producto
     * @param {Object} productData - Datos actualizados
     * @returns {Promise<Object>} producto actualizado
     */
    async updateProduct(productId, productData) {
        try {
            console.log("Updating Product:", productId, productData);
            
            const response = await this.httpClient.put(
                API_ENDPOINTS.PRODUCT.UPDATE(productId),
                productData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
   * Eliminar un producto
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Resultado de la eliminación
   */
    async deleteProduct(productId) {
        try {
            console.log("Deleting product:", productId);
            
            const response = await this.httpClient.delete(
                API_ENDPOINTS.PRODUCT.DELETE(productId)
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
   * Buscar productos
   * @param {string} searchTerm - Término de búsqueda
   * @param {string} [brandId] - ID de la marca para filtrar
   * @param {number} [limit=20] - Límite de resultados
   * @returns {Promise<Object[]>} Lista de productos encontrados
   */
    async searchProduct(searchTerm, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('q', searchTerm);
            
            if (options.limit) {
                queryParams.append('limit', options.limit);
            }

            const response = await this.httpClient.get(
                `${API_ENDPOINTS.PRODUCT.SEARCH}?${queryParams}`
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
   * Obtener estadísticas de productos
   * @returns {Promise<Object>} Estadísticas de productos
   */
    async getProductStats() {
        try {
            const response = await this.httpClient.get(API_ENDPOINTS.PRODUCT.STATS);
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
        console.error("ProductService error:", error);
        const message = error.response?.data?.message || error.message || "Error desconocido";
        return new Error(message);
    }
}

// Factory function para crear instancia del servicio
export const productService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new ProductService(httpClient);
};