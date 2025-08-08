import { HttpClient } from "../api/httpClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export class RmaStatusService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async approveRma(rmaId) {
        try {
            const response = await this.httpClient.patch(
                `${API_ENDPOINTS.RMA.APPROVE(rmaId)}`
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async rejectRma(rmaId, rejectionReason) {
        try {
            const response = await this.httpClient.patch(
                `${API_ENDPOINTS.RMA.REJECT(rmaId)}`,
                { rejectionReason }
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async markAsEvaluating(rmaId) {
        try {
            const response = await this.httpClient.patch(
                `${API_ENDPOINTS.RMA.MARK_EVALUATING(rmaId)}`
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async markAsPayment(rmaId, formData) {
        try {
            // Usamos formData para enviar el archivo PDF
            const response = await this.httpClient.patch(
                `${API_ENDPOINTS.RMA.MARK_PAYMENT(rmaId)}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async markAsProcessing(rmaId) {
        try {
            const response = await this.httpClient.patch(
                `${API_ENDPOINTS.RMA.MARK_PROCESSING(rmaId)}`
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async markAsInShipping(rmaId, trackingInformation) {
        try {
            const response = await this.httpClient.patch(
                API_ENDPOINTS.RMA.MARK_INSHIPPING(rmaId),
                { trackingInformation }
            );
            return this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async markAsComplete(rmaId) {
        try {
            console.log("markAsComplete service called:", { rmaId });
            console.log("Endpoint:", API_ENDPOINTS.RMA.MARK_COMPLETE(rmaId));

            const response = await this.httpClient.patch(
                API_ENDPOINTS.RMA.MARK_COMPLETE(rmaId)
            );
            return this.handleResponse(response);
        } catch (error) {
            console.error("Error en markAsComplete service:", error);
            throw this.handleError(error);
        }
    }

    handleResponse(response) {
        if (!response.success) {
            throw new Error(response.message || "Failed to update RMA status");
        }
        return response.data;
    }

    handleError(error) {
        console.error("handleError called with:", error);

        // Verificar si es un error de respuesta HTTP
        if (error.response && error.response.data) {
            const message = error.response.data.message || "Error del servidor";
            console.error("Error del servidor:", message);
            return new Error(message);
        }

        // Error de red u otro tipo
        const message = error.message || "Error desconocido";
        console.error("Error general:", message);
        return new Error(message);
    }
}
export const rmaStatusService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new RmaStatusService(httpClient);
};