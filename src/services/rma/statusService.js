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

    handleResponse(response) {
        if (!response.success) {
            throw new Error(response.message || "Failed to update RMA status");
        }
        return response.data;
    }

    handleError(error) {
        const message = error.response?.data?.message || error.message || "Error desconocido";
        return new Error(message);
    }
}
export const rmaStatusService = (baseUrl) => {
    const httpClient = new HttpClient(baseUrl);
    return new RmaStatusService(httpClient);
};