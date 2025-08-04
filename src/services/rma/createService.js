import { HttpClient } from "../api/httpClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export class RmaCreateService {
    constructor(httpClient) {
        this.httpClient = httpClient
    }

    async create(rmaData, countryId) {
        this.validateRmaData(rmaData);
        try {
            console.log("HEreeee ===>" , rmaData)
            const response = await this.httpClient.post(API_ENDPOINTS.RMA.CREATE, this.formatRmaData(rmaData));
            if (response.success && response.data) {
                console.log('data rma create', response)
            }
            console.log(response)
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }
    validateRmaData(rmaData) {
        console.log(rmaData)
        if (!rmaData) {
            throw new Error("RMA data is required");
        }
        const requiredFields = ['direccion', 'codigoPostal', 'products', 'countryId'];
        requiredFields.forEach(field => {
            if (!rmaData[field]) {
                throw new Error(`Field ${field} is required`);
            }
        });

        if (!Array.isArray(rmaData.products)) {
            throw new Error("Products must be an array");
        }
    }
    formatRmaData(rmaData) {
        console.log("hereee formarRMa", rmaData)
        return {
            countryId: rmaData.countryId,
            direccion: rmaData.direccion,
            codigoPostal: rmaData.codigoPostal,
            servicio: this.mapServiceType(rmaData.serviceType),
            products: rmaData.products.map(product => ({
                productId: product.productId,
                serial: product.serialNumber,
                model: product.model,
                reporteEvaluacion: product.reporteEvaluacion || ''
            }))
        };
    }
    mapServiceType(serviceType) {
        const serviceMap = {
            CALIBRATION: 'CALIBRACION',
            REPAIR: 'REPARACION',
            BOTH: 'AMBOS'
        };
        return serviceMap[serviceType] || 'REPARACION';
    }
    handleResponse(response) {
        if (!response.success) {
            throw new Error(response.message || "Failed to create RMA");
        }
        return response.data;
    }
    handleError(error) {
        const message = error.response?.data?.message || error.message || 'Error desconocido';
        return new Error(message);
    }
}

export const createRmaService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new RmaCreateService(httpClient);
};