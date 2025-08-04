import { HttpClient } from '../api/httpClient';
import { AuthTokenManager } from './authTokenManager';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export class AuthService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async register(userData) {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.success && response.data) {
        AuthTokenManager.setToken(response.data.token);
        AuthTokenManager.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials) {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        AuthTokenManager.setToken(response.data.token);
        AuthTokenManager.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile() {
    try {
      const response = await this.httpClient.get(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response.success && response.data) {
        AuthTokenManager.setUser(response.data);
        return response;
      }
      AuthTokenManager.removeToken();
      throw new Error(response.message || 'Error al obtener perfil');
    } catch (error) {
      AuthTokenManager.removeToken();
      throw this.handleError(error);
    }
  }

  async updateProfile(updateData) {
    try {
      const response = await this.httpClient.put(API_ENDPOINTS.AUTH.PROFILE, updateData);
      
      if (response.success && response.data) {
        AuthTokenManager.setUser(response.data);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(passwordData) {
    try {
      return await this.httpClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    AuthTokenManager.removeToken();
  }

  getCurrentUser() {
    return AuthTokenManager.getUser();
  }

  isAuthenticated() {
    return AuthTokenManager.isAuthenticated();
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Error desconocido';
    return new Error(message);
  }
}

const httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');
export const authService = new AuthService(httpClient);