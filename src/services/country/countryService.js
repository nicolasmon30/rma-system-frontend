import { HttpClient } from "../api/httpClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export class CountryService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Obtener todos los países (público, para registro)
     */
    async getAllCountries(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.includeStats !== undefined) {
                queryParams.append('includeStats', params.includeStats);
            }
            if (params.search) {
                queryParams.append('search', params.search);
            }
            if (params.orderBy) {
                queryParams.append('orderBy', params.orderBy);
            }

            const url = `${API_ENDPOINTS.COUNTRIES.LIST}${queryParams.toString() ? `?${queryParams}` : ''}`;
            console.log("Fetching countries from:", url);
            
            const response = await this.httpClient.get(url);
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Crear nuevo país (solo SUPERADMIN)
     */
    async createCountry(countryData) {
        try {
            console.log("Creating country:", countryData);
            
            const response = await this.httpClient.post(
                API_ENDPOINTS.COUNTRIES.CREATE,
                countryData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Actualizar país (solo SUPERADMIN)
     */
    async updateCountry(countryId, countryData) {
        try {
            console.log("Updating country:", countryId, countryData);
            
            const response = await this.httpClient.put(
                API_ENDPOINTS.COUNTRIES.UPDATE(countryId),
                countryData
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Eliminar país (solo SUPERADMIN)
     */
    async deleteCountry(countryId) {
        try {
            console.log("Deleting country:", countryId);
            
            const response = await this.httpClient.delete(
                API_ENDPOINTS.COUNTRIES.DELETE(countryId)
            );
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
        console.error("CountryService error:", error);
        const message = error.response?.data?.message || error.message || "Error desconocido";
        return new Error(message);
    }
}

export const countryService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new CountryService(httpClient);
};