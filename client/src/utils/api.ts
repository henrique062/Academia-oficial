import { API_BASE_URL } from '../constants';
import { ApiResponse } from '../types';

/**
 * Configuração padrão para requisições fetch
 */
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

/**
 * Função genérica para chamadas de API
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Ocorreu um erro na requisição',
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Métodos HTTP para interação com a API
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return fetchApi<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
}; 